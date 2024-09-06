import { LiaTeamspeak } from "react-icons/lia";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiSolidHome, BiUser } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { SlOptions } from "react-icons/sl";

interface EchoSideButton {
  title: string,
  icon: React.ReactNode
}

const sideBarMenuItems: EchoSideButton[]= [
   {
    title: 'Home',
     icon:  <BiSolidHome />
   },
   {
    title: 'Explore',
     icon:  <BiHash />
   },
   {
    title: 'Notifications',
     icon:  <BiBell />
   },
   {
    title: 'Messages',
     icon:  <BiEnvelope />
   },
   {
    title: 'Bookmarks',
     icon:  <BiBookmark />
   },
   {
    title: 'Profile',
     icon:  <BiUser />
   },
   {
    title: 'More Options',
    icon: <SlOptions />
   }
]

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen">
        <div className="col-span-3 pl-32 pt-4">
          <div className="text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all ">
            <LiaTeamspeak />
          </div>
          <div className="mt-3 text-2xl pr-4">
            <ul>
              {sideBarMenuItems.map((item) => (
                <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-2 w-fit cursor-pointer" key={item.title}>
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 p-3 flex">
              <button className="py-2 px-4 bg-[#1d9bf0] font-semibold text-lg rounded-full mx-50 w-full">Post</button>
            </div>
          </div>
        </div>
        
        <div className="col-span-5 border-l-[0.5px] border-r-[0.5px] h-screen overflow-scroll border-gray-700">
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          
        </div>
        <div className="col-span-3">hi</div>
      </div>
    </div>
  )
}
