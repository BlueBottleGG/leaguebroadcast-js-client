/**
 * Auto-generated REST API client for Custom overlay management and hosting.
 * Do not edit manually. Changes will be lost.
 *
 * @generated 2026-04-30
 */

import type { ApiClient } from "../ApiClient";
import type { cloudSyncResult } from "#types/cloud/cloudSyncResult";
import type { cloudOverlaysResponse } from "#types/cloud/overlay/cloudOverlaysResponse";
import type { registerOverlayRequest } from "#types/rest/customoverlay/registerOverlayRequest";
import type { updateOverlayRequest } from "#types/rest/customoverlay/updateOverlayRequest";
import type { customOverlayDescriptor } from "#types/shared/customoverlay/customOverlayDescriptor";
import type { devServerState } from "#types/shared/customoverlay/devServerState";

export class CustomOverlayApi {
  constructor(private readonly client: ApiClient) {}

  /** `GET customoverlay` */
  async getAll(): Promise<customOverlayDescriptor[]> {
    return this.client.get<customOverlayDescriptor[]>('customoverlay');
  }

  /** `POST customoverlay` */
  async register(req: registerOverlayRequest): Promise<customOverlayDescriptor> {
    return this.client.post<customOverlayDescriptor>('customoverlay', req);
  }

  /** `PUT customoverlay/{id:guid}` */
  async update(id: string, req: updateOverlayRequest): Promise<customOverlayDescriptor> {
    return this.client.put<customOverlayDescriptor>(`customoverlay/${id}`, req);
  }

  /** `DELETE customoverlay/{id:guid}` */
  async delete(id: string): Promise<void> {
    return this.client.delete<void>(`customoverlay/${id}`);
  }

  /** `GET customoverlay/{id:guid}/url` */
  async getUrl(id: string): Promise<unknown> {
    return this.client.get<unknown>(`customoverlay/${id}/url`);
  }

  /** `GET customoverlay/{id:guid}/devserver/status` */
  async getDevServerStatus(id: string): Promise<devServerState> {
    return this.client.get<devServerState>(`customoverlay/${id}/devserver/status`);
  }

  /** `POST customoverlay/{id:guid}/devserver/start` */
  async startDevServer(id: string): Promise<devServerState> {
    return this.client.post<devServerState>(`customoverlay/${id}/devserver/start`);
  }

  /** `POST customoverlay/{id:guid}/devserver/stop` */
  async stopDevServer(id: string): Promise<void> {
    return this.client.post<void>(`customoverlay/${id}/devserver/stop`);
  }

  /** `GET customoverlay/{id:guid}/export` */
  async export(id: string): Promise<unknown> {
    return this.client.get<unknown>(`customoverlay/${id}/export`);
  }

  /** `POST customoverlay/import` */
  async import(file: File): Promise<customOverlayDescriptor> {
    return this.client.post<customOverlayDescriptor>(`customoverlay/import?file=${encodeURIComponent(String(file))}`);
  }

  /** `GET customoverlay/cloud` */
  async listCloud(): Promise<cloudOverlaysResponse> {
    return this.client.get<cloudOverlaysResponse>('customoverlay/cloud');
  }

  /** `POST customoverlay/cloud/{id:guid}/upload` */
  async uploadToCloud(id: string): Promise<cloudSyncResult> {
    return this.client.post<cloudSyncResult>(`customoverlay/cloud/${id}/upload`);
  }

  /** `POST customoverlay/cloud/{cloudId}/download` */
  async downloadFromCloud(cloudId: string): Promise<cloudSyncResult> {
    return this.client.post<cloudSyncResult>(`customoverlay/cloud/${cloudId}/download`);
  }

  /** `POST customoverlay/cloud/sync` */
  async syncAll(): Promise<cloudSyncResult> {
    return this.client.post<cloudSyncResult>('customoverlay/cloud/sync');
  }
}

