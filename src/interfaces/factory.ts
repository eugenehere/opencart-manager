import { TFieldset } from "../types";
import IEntity from "./entity";

export default interface IFactory<TEntity> {
  create(...dependencies: any[]): TEntity;
  extract(criteria: TFieldset<any>): Promise<TEntity | undefined>;
  extractAll(criteria: TFieldset<any>): Promise<TEntity[]>;
}
