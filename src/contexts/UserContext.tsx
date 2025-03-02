import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, userService } from "../services/api/user";

interface UserContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("@App:userId");
      const storedToken = await AsyncStorage.getItem("@App:token");

      if (storedUserId && storedToken) {
        const userData = await userService.getById(storedUserId);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await userService.login(email, password);
      const { token, user: userData } = response;

      await AsyncStorage.setItem("@App:token", token);
      await AsyncStorage.setItem("@App:userId", userData.id);

      const fullUserData = await userService.getById(userData.id);
      setUser(fullUserData);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@App:token");
      await AsyncStorage.removeItem("@App:userId");
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user?.id) throw new Error("No user logged in");
      const updatedUser = await userService.updateProfile(user.id, userData);
      return setUser(updatedUser);
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
