import { Client, Databases, Storage, ID, Query } from 'appwrite';
import config from "../conf/conf.js";


class Service {
    constructor() {
        this.client = new Client()
            .setEndpoint(config.appwriteUrl) 
            .setProject(config.appwriteProjectId); 

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId, 
                config.appwriteCollectionId, 
                slug
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }
    async updatePost(postId, postData) {
        try {
            // Ensure "slug" is not sent in the update request
            const { slug,image, ...updatedData } = postData; 
            console.log("post data",postData);
            
            return await this.databases.updateDocument(
                config.appwriteDatabaseId, 
                config.appwriteCollectionId, 
                postId,
               updatedData
            );
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", error);
            return null;
        }
    }
    
    
    

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId, 
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId, 
                config.appwriteCollectionId, 
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // File upload service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                config.appwriteBucketId, 
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                config.appwriteBucketId, // Use config
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }
    

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            config.appwriteBucketId, // Use config
            fileId
        );
    }
}

const service = new Service();
export default service;
