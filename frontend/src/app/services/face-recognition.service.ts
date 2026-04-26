import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaceRecognitionService {
  private modelsLoaded = false;
  private readonly modelsPath = '/assets/models';
  private readonly apiBase = 'http://localhost:3000/auth';
  private faceapiModule: any;

  constructor(private http: HttpClient) {}

  /** Load all three required models (called once on first use) */
  async loadModels(): Promise<void> {
    if (this.modelsLoaded) return;
    
    // Dynamically import face-api.js only when needed to save massive bundle size
    this.faceapiModule = await import('face-api.js');
    
    await Promise.all([
      this.faceapiModule.nets.ssdMobilenetv1.loadFromUri(this.modelsPath),
      this.faceapiModule.nets.faceLandmark68Net.loadFromUri(this.modelsPath),
      this.faceapiModule.nets.faceRecognitionNet.loadFromUri(this.modelsPath),
    ]);
    this.modelsLoaded = true;
  }

  /**
   * Detect a face in the video element and return its 128-float descriptor.
   * Returns null if no face is detected.
   */
  async getEmbedding(video: HTMLVideoElement): Promise<Float32Array | null> {
    await this.loadModels();
    const detection = await this.faceapiModule
      .detectSingleFace(
        video,
        new this.faceapiModule.SsdMobilenetv1Options({ minConfidence: 0.5 }),
      )
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detection?.descriptor ?? null;
  }

  /**
   * Store the face descriptor on the backend for the logged-in user.
   * Requires a valid JWT in localStorage.
   */
  async enroll(descriptor: Float32Array): Promise<{ enrolled: boolean }> {
    const token = localStorage.getItem('bi_token');
    return firstValueFrom(
      this.http.post<{ enrolled: boolean }>(
        `${this.apiBase}/face-enroll`,
        {
          descriptor: Array.from(descriptor),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );
  }

  /**
   * Compare a new descriptor against the stored one on the backend.
   * Returns { match: boolean, distance: number }
   */
  async match(
    descriptor: Float32Array,
  ): Promise<{ match: boolean; distance: number }> {
    const token = localStorage.getItem('bi_token');
    return firstValueFrom(
      this.http.post<{ match: boolean; distance: number }>(
        `${this.apiBase}/face-match`,
        {
          descriptor: Array.from(descriptor),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
    );
  }

  /**
   * PUBLIC face login — sends email + descriptor, gets back a JWT if face matches.
   * No password required.
   */
  async faceLogin(
    email: string,
    descriptor: Float32Array,
  ): Promise<{ access_token: string }> {
    return firstValueFrom(
      this.http.post<{ access_token: string }>(`${this.apiBase}/face-login`, {
        email,
        descriptor: Array.from(descriptor),
      }),
    );
  }
}
