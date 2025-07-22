// import React from 'react';
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
// import { supabase } from '../lib/supabase';

// const AuthPage = () => {
//   return (
//     <div className="flex-1 bg-gray-900 text-white flex items-center justify-center p-6">
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-green-400 mb-2">Welcome to Track</h1>
//           <p className="text-gray-400">Sign in to save your favorite music</p>
//         </div>
        
//         <div className="bg-gray-800 rounded-lg p-6">
//           <Auth
//             supabaseClient={supabase}
//             appearance={{
//               theme: ThemeSupa,
//               variables: {
//                 default: {
//                   colors: {
//                     brand: '#22c55e',
//                     brandAccent: '#16a34a',
//                     brandButtonText: 'white',
//                     defaultButtonBackground: '#374151',
//                     defaultButtonBackgroundHover: '#4b5563',
//                     inputBackground: '#1f2937',
//                     inputBorder: '#374151',
//                     inputBorderHover: '#22c55e',
//                     inputBorderFocus: '#22c55e',
//                   }
//                 }
//               },
//               className: {
//                 container: 'auth-container',
//                 button: 'auth-button',
//                 input: 'auth-input',
//               }
//             }}
//             providers={[]}
//             redirectTo={window.location.origin}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
// src/pages/AuthPage.jsx
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

const AuthPage = () => (
    <div className="max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Log In or Sign Up</h2>
        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={['google', 'github']} // Optional: add social logins
        />
    </div>
);

export default AuthPage;