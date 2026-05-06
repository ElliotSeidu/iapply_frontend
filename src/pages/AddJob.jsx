import React from 'react'
import { FiSave } from 'react-icons/fi'

const AddJob = () => {

  const now = new Date()

  return (
    <div className="mx-2 mt-3 md:mx-5 md:mt-15 flex flex-col gap-10 h-full">
        <div className="flex items-center justify-center flex-col">
          <h3 className='text-2xl font-semibold'>Add New Application</h3>
          <p className='text-md font-light'>Keep your career momentum organized</p>
        </div>

        <div className="w-full flex justify-center">
          <form action="" className='bg-white shadow-lg w-full md:w-[700px] flex flex-col items-center justify-center gap-3 p-5 rounded-lg'>
            <div className="flex flex-col md:flex-row w-full gap-3">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="company-name" className='text-xs font-semibold'>COMPANY NAME*</label>
                <input type="text" placeholder='e.g. Acme Corp' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' required />
              </div>

              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="company-name" className='text-xs font-semibold'>JOB TITLE*</label>
                <input type="text" placeholder='e.g. Product Designer' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' required />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="company-name" className='text-xs font-semibold'>JOB LINK</label>
              <input type="text" placeholder='https://linkedin.com/jobs/...' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' />
            </div>

            <div className="flex flex-col md:flex-row w-full gap-3">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="company-name" className='text-xs font-semibold'>STATUS*</label>
                <select name="status" className='bg-[#e9d8fd] py-1.5 px-2 rounded-md border-[#6b46c1] outline-0' required>
                  <option value="" disabled selected>Select an option...</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="company-name" className='text-xs font-semibold'>DATE APPLIED*</label>
                <input type="date" placeholder='eg. Product Designer' className='bg-[#e9d8fd] py-1.5 pl-2 rounded-md border-[#6b46c1] outline-0' required />
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="company-name" className='text-xs font-semibold'>NOTES</label>
              <textarea placeholder='Mention key requirements, referral names, or prep notes' className='bg-[#e9d8fd] py-1.5 pl-2 resize-none rounded-md border-[#6b46c1] outline-0' rows={3}></textarea>
            </div>

            <div className="w-full">
              <button type='submit' className='w-full bg-[#6b46c1] text-white py-2 rounded-lg cursor-pointer flex flex-row items-center justify-center gap-2'><FiSave size={20} /> Save Application</button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center mb-5">
          <p>iApply Career Tracker © {now.getFullYear()}</p>
        </div>
    </div>
  )
}

export default AddJob