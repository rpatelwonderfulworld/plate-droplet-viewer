import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    if (this.config) return; 
    this.config = await firstValueFrom(
      this.http.get('/assets/app-config.json')
    );
  }

  getConfig<T = any>(key: string, fallback?: T): T {
    if (!this.config) {
      return fallback as T;
    }
    return (this.config[key] ?? fallback) as T;
  }
}
