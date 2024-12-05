// bridge-user-interface/src/components/NotificationBanner.tsx
import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  --stickyArea-backdropFilter: blur(10px);
  position: sticky;
  top: 0;
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  text-align: center;
  z-index: 1000;
  font-size: 0.875rem;
  line-height: 1.5; /* Adjust line spacing here */

  a {
    color: #0056b3;
  }
`;

const NotificationBanner: React.FC = () => {
    const message = import.meta.env.VITE_NOTIFICATION_MESSAGE || '';
  
    // Check if the message is empty or not defined
    if (!message) {
      return null; // Do not render the component at all
    }
  
    return (
      <Banner dangerouslySetInnerHTML={{ __html: message }} />
    );
  };
  
  export default NotificationBanner;