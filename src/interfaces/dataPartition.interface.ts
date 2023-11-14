export interface ISlider {
  idDataset: string;
  setRequiredDataset: any;
}
export interface IDataPartitionBody {
    idDataset:number;
    train:number;
    test:number;
    seed:number;
    target:string
}
