import { useEffect } from 'react';
import Login from "./login";

export default function Home() {

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const response = await fetch('/api/init_admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error('Admin initialization failed:', error);
      }
    };

    initializeAdmin();
  }, []);


  return (
    <Login/>
  );
}
