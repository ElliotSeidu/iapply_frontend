import { BsFileEarmarkText } from "react-icons/bs"
import { FaRegCheckCircle } from "react-icons/fa"
import { GrSchedule } from "react-icons/gr"
import { IoCloseCircleOutline } from "react-icons/io5"
import { TbBriefcase2 } from "react-icons/tb"
import { Link } from "react-router-dom"
import VelocityChart from "../graphs/VelocityChart"
import StatusChart from "../graphs/StatusChart"

const Dashboard = () => {
  return (
    <div className="mx-2 mt-3 md:mx-5 md:mt-15 flex flex-col gap-10">
        <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">Good morning, Frank</h2>
            <p className="text-sm">You have 3 interviews scheduled for this week, keep up the momentum</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-5 md:gap-10">
            <div className="shadow-xl rounded-lg h-32 px-3 md:px-5 py-4 flex flex-col">
                <div className="w-full h-full p-1 rounded-sm flex flex-row justify-between">
                    <h5 className="text-sm font-semibold">Total Applications</h5>
                    <BsFileEarmarkText size={20} className="text-[#6b46c1]" />
                </div>
                <h1 className="text-3xl font-semibold text-[#6b46c1]">42</h1>
                <p className="text-[#38a169] text-xs">+3 this week</p>
            </div>

            <div className="shadow-xl rounded-lg h-32 px-3 md:px-5 py-5 flex flex-col">
                <div className="w-full h-full p-1 rounded-sm flex flex-row justify-between">
                    <h5 className="text-sm font-semibold">Active Interviews</h5>
                    <GrSchedule size={20} className="text-[#3182ce]" />
                </div>
                <h1 className="text-3xl font-semibold text-[#3182ce]">5</h1>
                <p className="text-[#3182ce] text-xs">Next: Tomorrow</p>
            </div>

            <div className="shadow-xl rounded-lg h-32 px-3 md:px-5 py-5 flex flex-col gap-1">
                <div className="w-full h-full p-1 rounded-sm flex flex-row justify-between">
                    <h5 className="text-sm font-semibold">Offers Received</h5>
                    <FaRegCheckCircle size={20} className="text-[#38a169]" />
                </div>
                <h1 className="text-3xl font-semibold text-[#38a169]">4</h1>
                <p className="text-[#38a169] text-xs">Keep it up!</p>
            </div>

            <div className="shadow-xl rounded-lg h-32 px-3 md:px-5 py-5 flex flex-col gap-1">
                <div className="w-full h-full p-1 rounded-sm flex flex-row justify-between">
                    <h5 className="text-sm font-semibold">Rejections</h5>
                    <IoCloseCircleOutline size={20} className="text-[#e53e3e]" />
                </div>
                <h1 className="text-3xl font-semibold text-[#e53e3e]">32</h1>
                <p className="text-[#e53e3e] text-xs">Keep it Pushing</p>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
                <VelocityChart />
            </div>
            <div className="w-full md:w-1/2">
                <StatusChart />
            </div>
        </div>

        <div className="flex flex-col shadow-lg px-5 py-5 rounded-lg mb-20">
            <div className="flex flex-row justify-between items-center mt-5">
                <h3 className="text-md font-semibold">Recent Activity</h3>
                <Link to="analytics" className="text-sm underline decoration-[#6b46c1] text-[#6b46c1]">View All</Link>
            </div>

            <div className="flex flex-col gap-3 mt-5">

                <div className="flex flex-row justify-between bg-[#e9d8fd] p-2 rounded-lg gap-2 items-center shadow-md">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="w-7 h-7 bg-white rounded-lg items-center justify-center">
                            <TbBriefcase2 size={25} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm">TechFlow</h3>
                            <p className="text-xs font-light">Senior UX Designer</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="px-3 py-1 bg-[#38a169] rounded-lg">
                            <p className="text-xs">Interviewing</p>
                        </div>
                        <p className="text-xs flex justify-end font-light">Oct 24, 2023</p>
                    </div>
                </div>

                <div className="flex flex-row justify-between bg-[#e9d8fd] p-2 rounded-lg gap-2 items-center shadow-md">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="w-7 h-7 bg-white rounded-lg items-center justify-center">
                            <TbBriefcase2 size={25} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm">TechFlow</h3>
                            <p className="text-xs font-light">Senior UX Designer</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="px-3 py-1 bg-[#38a169] rounded-lg">
                            <p className="text-xs">Interviewing</p>
                        </div>
                        <p className="text-xs flex justify-end font-light">Oct 24, 2023</p>
                    </div>
                </div>

                <div className="flex flex-row justify-between bg-[#e9d8fd] p-2 rounded-lg gap-2 items-center shadow-md">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="w-7 h-7 bg-white rounded-lg items-center justify-center">
                            <TbBriefcase2 size={25} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm">TechFlow</h3>
                            <p className="text-xs font-light">Senior UX Designer</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="px-3 py-1 bg-[#38a169] rounded-lg">
                            <p className="text-xs">Interviewing</p>
                        </div>
                        <p className="text-xs flex justify-end font-light">Oct 24, 2023</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard