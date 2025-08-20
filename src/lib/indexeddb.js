// Сохраняем файл в IndexedDB
export function saveFileToIndexedDB(key, file) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDb", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(file, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      console.log("File saved to IndexedDB:");
    };

    request.onerror = () => reject(request.error);
  });
}

// Получаем файл из IndexedDB
export function getFileFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDb", 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("files", "readonly");
      const getRequest = tx.objectStore("files").get(key);
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => reject(getRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
}
export function deleteFileFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myDb", 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}
