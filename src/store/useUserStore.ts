
import { create } from "zustand"
import { persist } from "zustand/middleware"
type User ={
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
}
type userState ={
    user: User | null;
    users: User[]
    isLoggedIn: boolean;
    login: (email: string, password: string) => string | null;
    updateUser:(updatedUser: Partial<User>)=> void 
    logout: () => void;
}

const ADMIN = {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin' as const,
  };

export const useUserStore = create<userState>()(persist((set,get)=> ({
    user:null,
    users:[],
    isLoggedIn:false,
    login:(email,password)=>{
        if (email === ADMIN.email && password === ADMIN.password) {
            set({ user: ADMIN });
            return null;
          }
          const existingUser = get().users.find(user=>user.email === email && user.password === password)
          if (existingUser) {
            set({ user: existingUser });
            return null;
          }
          const newUser = {email, password, name: "user", role: "user" as const}
            set(state => ({ users: [...state.users, newUser], user: newUser }));
            return null
    },
    updateUser: (updatedFields) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updatedFields };

        set((state) => {
          const updatedUsers =
            updatedUser.role === 'user'
              ? state.users.map((u) =>
                  u.email === currentUser.email ? updatedUser : u
                )
              : state.users;

          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },
    logout: ()=> {set({user:null, isLoggedIn:false})
    localStorage.removeItem('user')},
}),
{name:"user-logins"}
))