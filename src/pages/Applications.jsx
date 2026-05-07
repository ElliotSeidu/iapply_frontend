import React from 'react'
import { Link } from 'react-router-dom'

const Applications = () => {
  return (
    <div className="mx-2 mt-3 md:mx-5 md:mt-15 rounded-xl shadow-lg h-full p-5">
        <div className="w-full flex flex-row items-center justify-between py-3">
          <h3 className="text-2xl font-semibold w-full md:w-1/2">Applications</h3>
          <Link to="/add-job">          
            <button className="text-white bg-purple-700 p-2 hover:bg-purple-900 rounded-xl cursor-pointer"> +  Add Application</button>
          </Link>
        </div>

        <div class="flex overflow-auto gap-4 p-1 bg-white md:justify-center md:items-center w-full">
          <label class="relative cursor-pointer">
            <input type="radio" name="status" value="applied" class="peer sr-only" defaultChecked />
            <div class="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-slate-100 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white">
              <span class="w-13 md:text-md md:font-medium text-xs">All Status</span>
              <span class="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-slate-200 text-slate-500 peer-checked:bg-purple-500 peer-checked:text-white">
                32
              </span>
            </div>
          </label>

          <label class="relative cursor-pointer">
            <input type="radio" name="status" value="applied" class="peer sr-only" />
            <div class="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-slate-100 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white">
              <span class="font-medium">Applied</span>
              <span class="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-slate-200 text-slate-500 peer-checked:bg-purple-500 peer-checked:text-white">
                12
              </span>
            </div>
          </label>

          <label class="relative cursor-pointer">
            <input type="radio" name="status" value="interviewing" class="peer sr-only" />
            <div class="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-slate-100 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white">
              <span class="font-medium">Interview</span>
              <span class="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-slate-200 text-slate-500 peer-checked:bg-purple-500/50 peer-checked:text-white">
                4
              </span>
            </div>
          </label>

          <label class="relative cursor-pointer">
            <input type="radio" name="status" value="offered" class="peer sr-only" />
            <div class="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-slate-100 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white">
              <span class="font-medium">Offered</span>
              <span class="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-slate-200 text-slate-500 peer-checked:bg-purple-500/50 peer-checked:text-white">
                2
              </span>
            </div>
          </label>

          <label class="relative cursor-pointer">
            <input type="radio" name="status" value="applied" class="peer sr-only" />
            <div class="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-slate-100 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white">
              <span class="font-medium">Rejected</span>
              <span class="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-slate-200 text-slate-500 peer-checked:bg-purple-500 peer-checked:text-white">
                10
              </span>
            </div>
          </label>

          <label class="relative cursor-pointer">
            <input type="radio" name="status" value="applied" class="peer sr-only" />
            <div class="flex items-center gap-2 px-3 py-2 rounded-full transition-all bg-slate-100 text-slate-600 peer-checked:bg-purple-600 peer-checked:text-white">
              <span class="font-medium">Withdrawn</span>
              <span class="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-slate-200 text-slate-500 peer-checked:bg-purple-500 peer-checked:text-white">
                3
              </span>
            </div>
          </label>
      </div>
    </div>
  )
}

export default Applications