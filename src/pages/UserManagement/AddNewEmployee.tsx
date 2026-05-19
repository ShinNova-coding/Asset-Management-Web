import React from 'react';
import {
  ArrowLeft,
  User,
  Briefcase,
  Contact,
  ChevronDown,
  Calendar,
} from 'lucide-react';

import { Link } from 'react-router-dom';
const AddEmployeeForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <Link
            to="/employees"
            className="mb-4 flex items-center text-sm font-medium text-blue-600 hover:underline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Employee 
        </Link>
        
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Add New Employee</h1>
        

        {/* Form Card */}
        <div className="bg-gray-100 rounded-lg border border-slate-200 shadow-sm p-10">
          <form className="space-y-10">
            
            {/* General Information Section */}
            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                <User size={20} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-blue-600">General Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                 
                    className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Employee ID</label>
                  <input 
                    type="text" 
                  
                    className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                   
                    className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Joining Date</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="mm/dd/yyyy" 
                      className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* Organizational Placement Section */}
            <section>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                <Briefcase size={20} className="text-slate-400" />
                <h2 className="text-lg font-semibold text-blue-600">Organizational Placement</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Position</label>
                  <input 
                    type="text" 
                    
                    className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Role / Access Level</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-slate-700">
                      <option>Employee</option>
                      <option>Admin</option>
                      <option>HR</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information Section */}
          
           
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2"> <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</label>
 <input type="text" className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
 </div> 
<div className="space-y-2"> <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Status</label> 

 <input type="text" className="w-full px-4 py-3 rounded-md border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
 </div> 
</div> 


            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <button 
                type="button" 
                className="px-8 py-2.5 rounded border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Save 
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;