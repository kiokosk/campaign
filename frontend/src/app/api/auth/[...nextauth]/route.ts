import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/types/user';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
       
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'INFLUENCER' as UserRole, 
          accessToken: '', 
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();
          
          if (response.ok && data) {
            
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              image: data.user.avatar,
              role: data.user.role as UserRole,
              accessToken: data.access_token,
            };
          }
          return null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };




// import NextAuth from 'next-auth';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { JWT } from 'next-auth/jwt';
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
        
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(credentials),
//           });

//           const user = await response.json();
//           if (response.ok && user) {
//             return user;
//           }
//           return null;
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         } catch (error) {
//           return null;
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (account && user) {
//         return {
//           ...token,
//           accessToken: user.accessToken,
//           role: user.role,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.role = token.role;
//       session.user.accessToken = token.accessToken;
//       return session;
//     }
//   },
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//   },
//   session: {
//     strategy: 'jwt',
//   },
// });

// export { handler as GET, handler as POST };