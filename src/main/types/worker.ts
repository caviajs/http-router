export abstract class Worker {
  public readonly abstract metadata: WorkerMetadata;

  public abstract handle(): Promise<void>;
}

export interface WorkerMetadata {
  readonly expression: string;
}
