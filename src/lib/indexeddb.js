// Open DB with guaranteed "files" store
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDb", 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files"); // 👈 ensure store exists
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = () => reject(request.error);
  });
}
// Save
export async function saveFileToIndexedDB(key, file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(file, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Get
export async function getFileFromIndexedDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const request = tx.objectStore("files").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Delete
export async function deleteFileFromIndexedDB(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const request = tx.objectStore("files").delete(key);

    request.onsuccess = () => {
      console.log(`✅ File with key ${key} deleted`);
      resolve({ success: true });
    };
    request.onerror = () => {
      console.error("❌ Failed to delete file:", request.error);
      resolve({ success: false, error: request.error });
    };
  });
}

// // Сохраняем файл в IndexedDB
// export function saveFileToIndexedDB(key, file) {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("myDb", 1);

//     request.onupgradeneeded = () => {
//       const db = request.result;
//       if (!db.objectStoreNames.contains("files")) {
//         db.createObjectStore("files");
//       }
//     };

//     request.onsuccess = () => {
//       const db = request.result;
//       const tx = db.transaction("files", "readwrite");
//       tx.objectStore("files").put(file, key);
//       tx.oncomplete = () => resolve(true);
//       tx.onerror = () => reject(tx.error);
//       console.log("File saved to IndexedDB:");
//     };

//     request.onerror = () => reject(request.error);
//   });
// }

// // Получаем файл из IndexedDB
// export function getFileFromIndexedDB(key) {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("myDb", 1);
//     request.onsuccess = () => {
//       const db = request.result;
//       const tx = db.transaction("files", "readonly");
//       const getRequest = tx.objectStore("files").get(key);
//       getRequest.onsuccess = () => resolve(getRequest.result);
//       getRequest.onerror = () => reject(getRequest.error);
//     };
//     request.onerror = () => reject(request.error);
//   });
// }
// export function deleteFileFromIndexedDB(key) {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("myDb", 1);

//     request.onerror = () => {
//       console.error("❌ Failed to open IndexedDB:", request.error);
//       resolve({ success: false, error: request.error });
//     };

//     request.onsuccess = () => {
//       try {
//         const db = request.result;
//         if (!db.objectStoreNames.contains("files")) {
//           const err = new Error("Object store 'files' does not exist");
//           console.error(err);
//           resolve({ success: false, error: err });
//           return;
//         }
//         const tx = db.transaction("files", "readwrite");
//         const store = tx.objectStore("files");
//         const deleteRequest = store.delete(key);
//         deleteRequest.onsuccess = () => {
//           console.log(`✅ File with key ${key} deleted`);
//         };

//         deleteRequest.onerror = () => {
//           console.error("❌ Failed to delete file:", deleteRequest.error);
//           resolve({ success: false, error: deleteRequest.error });
//         };

//         tx.oncomplete = () => resolve({ success: true });
//         tx.onerror = () => {
//           console.error("❌ Transaction failed:", tx.error);
//           resolve({ success: false, error: tx.error });
//         };
//       } catch (err) {
//         console.error("❌ Unexpected error during deletion:", err);
//         resolve({ success: false, error: err });
//       }
//     };
//   });
// }
