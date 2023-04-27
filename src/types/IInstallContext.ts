export interface IInstallContext {
	configuration: IConfig[]
}

export interface IConfig {
    Label: string;
    Name: string;
    Type: string;
    Value: any;
  }