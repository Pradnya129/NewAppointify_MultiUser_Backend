"use client";
import React, { useEffect, useState } from 'react'
import Dashboard_Content from '../Components/Main_Dashboard/Dashboard_Page_Components/Dashboard_Content'
import { useRouter } from 'next/navigation';
import withAuth from '../Dashboard/WithAuth/withAuth'
import { jwtDecode } from "jwt-decode";

const DashboardPage = () => {
    const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/');
    }
  }, []);

     const [userRole, setUserRole] = useState(null);
    
       useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role); // ✅ set role in state
        }
      }, []);
  
  return (
       
       <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
            
        {userRole === 'admin' && (
                  <Dashboard_Content/>)
                    }
        </div>           
    </div>
  )
}

export default withAuth(DashboardPage);