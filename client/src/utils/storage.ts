const DB_NAME = 'FloorVisualizerDB';
const DB_VERSION = 1;
const STORE_ROOM = 'room';
const STORE_FLOORS = 'floors';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_ROOM)) {
                db.createObjectStore(STORE_ROOM);
            }
            if (!db.objectStoreNames.contains(STORE_FLOORS)) {
                db.createObjectStore(STORE_FLOORS);
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });

    return dbPromise;
};

export const saveRoom = async (imageBlob: Blob): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_ROOM, 'readwrite');
        const store = transaction.objectStore(STORE_ROOM);
        const request = store.put(imageBlob, 'current');

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getRoom = async (): Promise<Blob | null> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_ROOM, 'readonly');
        const store = transaction.objectStore(STORE_ROOM);
        const request = store.get('current');

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};

export const saveFloor = async (sku: string, imageBlob: Blob): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_FLOORS, 'readwrite');
        const store = transaction.objectStore(STORE_FLOORS);
        const request = store.put(imageBlob, sku);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getFloor = async (sku: string): Promise<Blob | null> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_FLOORS, 'readonly');
        const store = transaction.objectStore(STORE_FLOORS);
        const request = store.get(sku);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};

export const getAllFloors = async (): Promise<Record<string, Blob>> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_FLOORS, 'readonly');
        const store = transaction.objectStore(STORE_FLOORS);
        const request = store.getAllKeys();
        const floors: Record<string, Blob> = {};

        request.onsuccess = async () => {
            const keys = request.result as string[];
            const promises = keys.map(key =>
                new Promise<void>((resolveKey) => {
                    const req = store.get(key);
                    req.onsuccess = () => {
                        floors[key] = req.result;
                        resolveKey();
                    };
                })
            );
            await Promise.all(promises);
            resolve(floors);
        };
        request.onerror = () => reject(request.error);
    });
};

export const clearFloors = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_FLOORS, 'readwrite');
        const store = transaction.objectStore(STORE_FLOORS);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
