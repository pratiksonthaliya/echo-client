import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BiBookmark, BiMessageRounded, BiSolidBookmark } from 'react-icons/bi'
import { Maybe, Post } from '@/gql/graphql'
import Link from 'next/link'
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '@/clients/api'
import { toggleLikeMutation } from '@/graphql/mutation/like'
import toast from 'react-hot-toast'
import { usePostLikes } from '@/hooks/like'
import { useCurrentUser } from '@/hooks/user'
import { toggleBookmarkMutation } from '@/graphql/mutation/bookmark'
import GetBookmarks from '../GetBookmarks'
import Model from "@/components/LikeModel";
import { usePostComments } from '@/hooks/comment'
import LikeLoader from '../Loaders/LikeLoader'
import BookmarkLoader from '../Loaders/BookmarkLoader'

interface FeedCardProps  {
  data: Post 
}

const handleDate = (createdAt: Maybe<string> | undefined) => {
  let dateObject: Date | null = null;
  if (createdAt) {
      const timestamp = Number(createdAt);
      if (!isNaN(timestamp) && timestamp.toString().length === 13) { // 13 digits for milliseconds
          dateObject = new Date(timestamp);
      } else {
          dateObject = new Date(createdAt);
      }
  }
  return dateObject ? format(dateObject, 'MMM d, h:mm a') : 'Invalid Date or Time';
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const {data} = props;
  const {user} = useCurrentUser();

  const postId = data?.id;
  const userId = user?.id;
  const queryClient = useQueryClient();

  const {data: commentData} = usePostComments(postId);

  const { data: likeData } = usePostLikes(postId);
  const bookmarkData = GetBookmarks(userId as string); // useUserBookmarks(userId as string);

  const likeCount = likeData?.getPostLikes?.length ?? 0;
  const isLiked = (likeData?.getPostLikes?.some((like) => like?.user?.id === user?.id) && likeCount > 0) ?? false;
  const isBookmarked = user ? (bookmarkData?.getUserBookmarks?.some((bookmark) => bookmark?.post?.id === postId)) ?? false : false;

  const [showUserLiked, setShowUserLiked] = useState(false);  // To manage followers modal

  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    if (data?.createdAt) {
      const date = handleDate(data?.createdAt);
      setFormattedDate(date);
    }
  }, [data?.createdAt]);


  const likeMutation = useMutation({
    mutationFn: () => graphqlClient.request(toggleLikeMutation, { postId }),
    onMutate: () => {
      setIsLiking(true);  
    },
    onSuccess: (data) => {
      setIsLiking(false); 
      queryClient.invalidateQueries({queryKey: ["post-likes", postId], refetchType: 'all'});
      queryClient.invalidateQueries({queryKey: ["liked-posts", userId], refetchType: 'all'});
      toast.success(data.toggleLike.isLiked ? 'Liked!❤️' : 'Unliked!', { id: '2' });
    },
    onError: (error: Error) => {
      setIsLiking(false); 
      toast.error(`Error: ${error.message}`, { id: '2' });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => graphqlClient.request(toggleBookmarkMutation, { postId }),
    onMutate: () => {
      setIsBookmarking(true); 
    },
    onSuccess: (data) => {
      setIsBookmarking(false);
      queryClient.invalidateQueries({queryKey: ["add-bookmark", userId], refetchType: 'all'});
      toast.success(data.toggleBookmark.isBookmarked ? 'Bookmarked!' : 'Removed From Bookmark!', { id: '3' });
    },
    onError: (error: Error) => {
      setIsBookmarking(false);
      toast.error(`Error: ${error.message}`, { id: '3' });
    },
  });

  const handleLike = () => {
    if(!user || !user?.id){
      toast.error('Please login to Like a Post!');
      return;
    }
    likeMutation.mutate();
  };

  const handleBookmark = () => {
    if(!user || !user?.id){
      toast.error('Please login to Bookmark a Post!');
      return;
    }
    bookmarkMutation.mutate();
  };
 
  return (
    <div className='p-5 border-t-[0.5px] border-gray-700 hover:bg-gray-900 transition-all cursor-pointer '>
      <div className='grid grid-cols-12 gap-2'>
        <div className='col-span-1 gap-3'>
        <Link href={`/${data?.author?.id}`}>
          {data?.author?.profileImageUrl && <Image alt="user-image" src={data?.author?.profileImageUrl} height={50} width={50} className='rounded-full' />} 
        </Link>
        </div>
        <div className='col-span-11'>
          <div className='flex gap-2'>
            <h3 className='text-md font-semibold cursor-pointer'>
              <Link href={`/${data?.author?.id}`}>{data?.author?.firstName} {data?.author?.lastName}</Link>
            </h3>
            {
              formattedDate && <p className='text-slate-600 text-sm m-0.5'>· {formattedDate}</p>
            }
          </div>
          <Link href={{
            pathname: `/posts/${postId}`,
            query: { postData: JSON.stringify(data) }, // Pass post data as a JSON string
          }}>
            {data?.content}
          {data?.imageURL && <Image src={data?.imageURL} alt='Post-image' height={300} width={300}/>}
          </Link>
          <div className='flex flex-row justify-between mt-5 text-md items-center w-[90%] p-2 text-gray-500'>
            <Link href={{
              pathname: `/posts/${postId}`,
              query: { postData: JSON.stringify(data) }, // Pass post data as a JSON string
            }}>
            <div className='cursor-pointer flex gap-1 items-center'>
              <span>
                <BiMessageRounded/>  
              </span>
              <span>
                {commentData?.getCommentsByPost?.length}
              </span>
            </div>
            </Link>
            {/* <div><FaRetweet/></div> */}
            <div className='cursor-pointer flex gap-1 items-center'>
              <span onClick={handleLike} >
              {/* {isLiked ? <AiFillHeart color='red' /> : <AiOutlineHeart />} */}
              {isLiking ? <LikeLoader isLiked={isLiked}/> : (isLiked ? <AiFillHeart color='red' /> : <AiOutlineHeart />)}
              </span>
              <span onClick={() => setShowUserLiked(true)} >
              {likeCount}
              </span>
            </div>
            <Model isOpen={showUserLiked} onClose={() => setShowUserLiked(false)} title="Liked by">
              <ul>
                {likeData?.getPostLikes?.map((like) => (
                  <button key={like?.id} onClick={() => {
                    setShowUserLiked(false)
                  }}>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-2 md:px-3 cursor-pointer mb-4 max-w-full">
                      {like?.user?.profileImageUrl && (
                        <Image className="rounded-full flex-shrink-0" src={like?.user?.profileImageUrl} alt="user-image" height={30} width={30} />
                      )}
                      <div className='hidden md:block overflow-hidden'>
                        <h3 className="text-sm lg:text-md truncate">{like?.user?.firstName} {like?.user?.lastName}</h3>
                      </div>
                    </div>
                  </button> 
                ))}
              </ul>
            </Model>
            <div onClick={handleBookmark} className='cursor-pointer flex gap-1 items-center'>
              <span>
              {/* {isBookmarked ? <BiSolidBookmark color='skyblue' /> : <BiBookmark />} */}
              {isBookmarking ? <BookmarkLoader isBookmarked = {isBookmarked}/> : (isBookmarked ? <BiSolidBookmark color='skyblue' /> : <BiBookmark />)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
