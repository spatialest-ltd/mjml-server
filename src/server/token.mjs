import express from "express";

/**
 * @param {express.Request} req
 */
export default function extractToken(req) {
   // Check query param
   let token = req.query.token;
   if (token !== undefined) {
       return token;
   }
   token = req.header('X-Token');
   if (token !== undefined) {
       return token;
   }
   return undefined;
}