import { NextResponse } from "next/server";

// Store waiting clients
const waitingClients: { resolve: (value: any) => void }[] = [];

export async function GET() {
  return new Promise((resolve) => {
    // Store request
    const client = { resolve };
    waitingClients.push(client);

    // Remove stale requests 
    setTimeout(() => {
      const index = waitingClients.indexOf(client);
      if (index !== -1) {
        waitingClients.splice(index, 1);
        resolve(NextResponse.json({ message: "No new users", event: null }));
      }
    }, 30000);
  });
}



export async function notifyClients(newUser: { id: number; name: string; email: string }) {
  while (waitingClients.length > 0) {
    const client = waitingClients.shift();
    if (client) {
      client.resolve(NextResponse.json({ event: "new_user", user: newUser }));
    }
  }
}





// import { NextResponse } from "next/server";

// // Store waiting clients
// const waitingClients: { resolve: (value: any) => void }[] = [];

// export async function GET() {
//   return new Promise((resolve) => {
//     // Add request to waiting clients
//     waitingClients.push({ resolve });

//     // Set a timeout 
//     setTimeout(() => {
//       const index = waitingClients.indexOf({ resolve });
//       if (index !== -1) {
//          // Remove stale request
//         waitingClients.splice(index, 1);
//         resolve(NextResponse.json({ message: "No new users", event: null }));
//       }
//     }, 30000); 
//   });
// }


// export async function notifyClients(newUser: { id: number; name: string; email: string }) {
//   while (waitingClients.length > 0) {
//     const client = waitingClients.shift(); 
//     if (client) {
//       client.resolve(NextResponse.json({ event: "new_user", user: newUser }));
//     }
//   }
// }
















