import React from 'react'

const Settings = () => {
  return (
    <div className="mx-2 mt-3 md:mx-5 md:mt-15 gap-4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-2 bg-white w-full rounded-xl shadow-xl p-4">
            <div className="w-20 h-20 md:w-25 md:h-25 rounded-full shadow-xl p-2 flex items-center">
              <img src="pic.jpg" alt="Profile pic" className='rounded-full' />
            </div>
            <div className="flex flex-col gap-1 justify-center items-center md:items-start">
              <h2 className="text-3xl font-semibold">Alex Rivera</h2>
              <p className="text-sm font-light">alex@example.com</p>
            </div>

            <div className="flex flex-row md:flex-col gap-3 justify-center items-center md:ml-auto">
              <div className="bg-purple-200 text-[#6b46c1] text-sm md:text-lg rounded-lg px-2 py-1 font-bold">
                12 APPLICATIONS
              </div>
              <div className="bg-green-200 text-md text-sm md:text-lg text-[#38a169] rounded-lg px-2 py-1 font-bold">
                3 INTERVIEWS
              </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className='flex flex-col gap-3 shadow-lg p-3 w-full md:w-1/2 rounded-lg'>
            <h3 className="text-xl font-semibold">Account Details</h3>

            <form action="" className='flex flex-col gap-3'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col w-full">
                  <label htmlFor="full-name" className='text-sm font-semibold'>Full Name</label>
                  <input type="text" placeholder='e.g. Franklin Moore' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="email-address" className='text-sm font-semibold'>Email Address</label>
                  <input type="email" placeholder='moore@gmail.com' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="role" className='text-sm font-semibold'>Current Role</label>
                  <input type="text" placeholder='e.g. Acme Corp' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="location" className='text-sm font-semibold'>Location</label>
                  <input type="text" placeholder='San Francisco, CA' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
                </div>
              </div>
              <div className="flex w-full items-center justify-center md:justify-end">
                <button type='submit' className='w-full md:w-70 bg-[#6b46c1] text-white rounded-lg cursor-pointer flex flex-row items-center justify-center p-1 hover:bg-purple-800'>Save Changes</button>
              </div>
            </form>
          </div>

          <form action="" className="flex flex-col gap-3 shadow-lg p-3 w-full md:w-1/2 justify-center rounded-lg">
            <h3 className="text-xl font-semibold">Password Change</h3>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="company-name" className='text-xs font-semibold'>Current Password</label>
                <input type="password" placeholder='Password...' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
              </div>
              <div className="flex flex-row gap-3">
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="company-name" className='text-xs font-semibold'>New Password</label>
                  <input type="password" placeholder='Password...' className='w-full bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <label htmlFor="company-name" className='text-xs font-semibold'>Confirm Password</label>
                  <input type="password" placeholder='Password...' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0 w-full' />
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-center md:justify-end">
                <button type='submit' className='w-full md:w-70 bg-[#6b46c1] text-white rounded-lg cursor-pointer flex flex-row items-center justify-center p-1 hover:bg-purple-800'>Update Password</button>
              </div>
          </form>
        </div>

        <div className="flex flex-col p-3 rounded-lg shadow-lg gap-5">
          <h3 className='text-2xl font-semibold'>Notification Preferences</h3>

          <div className="flex flex-row w-full border-b justify-between px-4 items-center pb-5">
            <label htmlFor="email-notifications" className='text-md font-semibold flex flex-col justify-center'>
              Email Notifications
              <span className="text-[10px] md:text-xs">Receive alerts via email</span>
            </label>
            <input type="checkbox" />
          </div>

          <div className="flex flex-row w-full border-b justify-between px-4 items-center pb-5">
            <label htmlFor="push-notifications" className='text-md font-semibold flex flex-col justify-center'>
              Push Notifications
              <span className="text-[10px] md:text-xs">Get instant updates on your browser or mobile device</span>
            </label>
            <input type="checkbox" />
          </div>

          <div className="flex flex-row w-full border-b justify-between px-4 items-center pb-5">
            <label htmlFor="weekly-summary" className='text-md font-semibold flex flex-col justify-center'>
              Weekly Summary
              <span className="text-[10px] md:text-xs">A curated report of your application progress every Monday</span>
            </label>
            <input type="checkbox" />
          </div>
        </div>

        <button className="border rounded-lg border-red-400 md:m-auto p-2 w-full md:w-1/3 cursor-pointer hover:text-white hover:bg-red-400 text-red-600">Sign Out ➡️</button>

        <div className="flex flex-col bg-red-200 rounded-lg shadow-lg py-2 px-3 mb-20">
          <div className="flex flex-col justify-between py-2 items-center gap-5">
            <p className='text-red-600'>Permanently delete your account and all your application data.</p>
            <button className="bg-red-700 px-2 py-1 rounded-lg cursor-pointer text-white hover:bg-red-900">Delete Account</button>
          </div>
        </div>
    </div>
  )
}

export default Settings