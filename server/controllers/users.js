import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../db.js";

export const addUser = async (req, res)=>{
    try {
      // ConvierteRecipeValue a un objeto plano
      const userData = {
        id:req.body.id,
        role:req.body.role,
      };
      const lotsCollection = collection(db, 'users');
      const docRef = await addDoc(lotsCollection, userData);
      res.send(docRef.id);
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
  }
}

export const getUser = async (req, res)=>{
   try {
      
      const userDocRef = collection(db, 'users');

      const q = query(userDocRef, where("id", "==", req.params.id));
      const querySnapshot = await getDocs(q);
      const userId = querySnapshot.docs[0].id;

      const user = await getDoc(doc(db, 'users', userId));
      res.send(user.data())  
    } catch (error) {
      console.error('Error listing user:', error);
      return null;
    }
}