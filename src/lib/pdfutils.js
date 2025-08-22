// "use client";
// Save file as ArrayBuffer in IndexedDB

//       };

//       request.onsuccess = (event) => {
//         const db = event.target.result;
//         const tx = db.transaction(["files"], "readwrite");
//         const store = tx.objectStore("files");

//         const putRequest = store.put(arrayBuffer, "myPDF");

//         putRequest.onsuccess = () => resolve("File saved");
//         putRequest.onerror = (e) => {
//           if (e.target.error?.name === "QuotaExceededError") {
//             reject("Not enough space in IndexedDB");
//           } else {
//             reject("Error saving: " + e.target.error);
//           }
//         };
//       };

//       request.onerror = () => reject("Error opening DB");
//     } catch (err) {
//       reject("Error converting file: " + err.message);
//     }
//   });
// }
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("MyFileDB", 1);

//     request.onupgradeneeded = function (event) {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains("files")) {
//         db.createObjectStore("files");
//       }
//     };
//     request.onsuccess = function (event) {
//       const db = event.target.result;
//       const transaction = db.transaction(["files"], "readwrite");
//       const store = transaction.objectStore("files");

//       const putRequest = store.put(file, "myPDF");

//       putRequest.onsuccess = () => {
//         resolve("File saved");
//       };
//       putRequest.onerror = (e) => {
//         if (e.target.error?.name === "QuotaExceededError") {
//           reject("Not enough space in IndexedDb");
//         } else {
//           reject("Error saving: " + e.target.error);
//         }
//       };
//     };
//     request.onerror = () => reject("Error opening DB");
//   });
// }

export function loadFileFromIndexedDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyFileDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(["files"], "readonly");
      const store = tx.objectStore("files");

      const getRequest = store.get("myPDF");

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          const blob = new Blob([getRequest.result], {
            type: "application/pdf",
          });
          resolve(blob);
        } else {
          reject("File not found");
        }
      };

      getRequest.onerror = () => reject("Download error");
    };

    request.onerror = () => reject("Error opening DB");
  });
}

//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("MyFileDB", 1);

//     request.onsuccess = function (event) {
//       const db = event.target.result;
//       const transaction = db.transaction(["files"], "readonly");
//       const store = transaction.objectStore("files");

//       const getRequest = store.get("myPDF");

//       getRequest.onsuccess = () => {
//         resolve(getRequest.result);
//       };
//       getRequest.onerror = (e) => {
//         reject("Download Error");
//       };
//     };
//     request.onerror = () => reject("Error opening DB");
//   });
// }

export function deleteFileFromIndexedDb(key = "myPDF") {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyFileDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(["files"], "readwrite");
      const store = tx.objectStore("files");

      // Check if key exists before deleting
      const getRequest = store.get(key);
      getRequest.onsuccess = () => {
        if (getRequest.result === undefined) {
          resolve("File not found"); // Key doesn’t exist
        } else {
          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => resolve("File deleted");
          deleteRequest.onerror = () => reject("Delete error");
        }
      };
      getRequest.onerror = () => reject("Error checking file");
    };

    request.onerror = () => reject("Error opening DB");
  });
}
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("MyFileDB", 1);

//     request.onsuccess = function (event) {
//       const db = event.target.result;
//       const tx = db.transaction(["files"], "readwrite");
//       const store = tx.objectStore("files");

//       const getRequest = store.get(key);
//       getRequest.onsuccess = () => {
//         if (getRequest.result === undefined) {
//           resolve("File not found"); // key doesn’t exist
//         } else {
//           const deleteRequest = store.delete(key);
//           deleteRequest.onsuccess = () => resolve("File deleted");
//           deleteRequest.onerror = () => reject("Delete error");
//         }
//       };
//       getRequest.onerror = () => reject("Error checking file");
//     };
//     //   const transaction = db.transaction(["files"], "readwrite");
//     //   const store = transaction.objectStore("files");

//     //   const deleteRequest = store.delete(key);

//     //   deleteRequest.onsuccess = () => {
//     //     resolve("File deleted");
//     //   };
//     //   deleteRequest.onerror = (e) => {
//     //     reject("Delete Error");
//     //   };
//     // };
//     request.onerror = () => reject("Error opening DB");
//   });
// }
