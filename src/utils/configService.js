// src/utils/configService.js
import axios from 'axios';

// Configuration for our server requests
const API_SERVER = 'https://server.gpeclub.com:1000'; // Update with your actual server URL
const CLIENT_SECRET = 'ILoveGPEClub'; // This should be securely stored in your production environment

class ConfigService {
  constructor() {
    this.config = null;
    this.isLoading = false;
    this.loadPromise = null;

    // Create axios instance with default headers
    this.apiClient = axios.create({
      baseURL: API_SERVER,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Secret': CLIENT_SECRET
      }
    });
  }

  // Load configuration including API keys from the server
  async loadConfig() {
    if (this.config) return this.config;
    if (this.loadPromise) return this.loadPromise;

    this.isLoading = true;

    this.loadPromise = this.apiClient.get('/api/config')
      .then(response => {
        if (response.data.authenticated) {
          this.config = response.data;
          console.log('Configuration loaded successfully');
          return this.config;
        } else {
          console.error('Authentication failed when loading config');
          return null;
        }
      })
      .catch(error => {
        console.error('Failed to load config from server:', error);
        // Fallback to localStorage if available (temporary during migration)
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) {
          return {
            authenticated: true,
            apiKeys: {
              openai: storedKey
            }
          };
        }
        return null;
      })
      .finally(() => {
        this.isLoading = false;
        this.loadPromise = null;
      });

    return this.loadPromise;
  }

  // Get the OpenAI API key
  async getOpenAIApiKey() {
    const config = await this.loadConfig();
    return config?.apiKeys?.openai || null;
  }

  // Get the Deepseek API key
  async getDeepseekApiKey() {
    const config = await this.loadConfig();
    return config?.apiKeys?.deepseek || null;
  }
}

// Create and export a singleton instance
export const configService = new ConfigService();
