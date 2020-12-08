import IDatabase from "./interfaces/database";
import AttributeModel from "./models/attribute/attribute";
import CategoryModel from "./models/category/category";
import ManufacturerModel from "./models/manufacturer/manufacturer";
import OptionModel from "./models/option/option";
import ProductModel from "./models/product/product";

export default class Model {
  constructor(private database: IDatabase) {}

  public product = new ProductModel(this.database);

  public category = new CategoryModel(this.database);

  public option = new OptionModel(this.database);

  public attribute = new AttributeModel(this.database);

  public manufacturer = new ManufacturerModel(this.database);

  destroyConnection() {
    return this.database.close();
  }
}
