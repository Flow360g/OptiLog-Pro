import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#2A6FEE',
              brandAccent: '#2A6FEE',
              brandButtonText: 'white',
            },
          },
          google: {
            colors: {
              brand: '#f0f0f0',
              brandAccent: '#f0f0f0',
              brandButtonText: '#000',
            },
          },
        },
        className: {
          anchor: 'text-gray-500 hover:text-gray-700',
          container: 'gap-3',
          divider: 'bg-gray-300',
          label: 'text-gray-700',
          input: 'bg-white border-gray-300 text-gray-900',
          loader: 'text-gray-500',
          message: 'text-gray-500',
        },
      }}
      providers={["google"]}
      redirectTo={window.location.origin}
    />
  );
};