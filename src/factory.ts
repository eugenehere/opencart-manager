import AttributeFactory from "./factories/attribute";
import CategoryFactory from "./factories/category";
import ManufacturerFactory from "./factories/manufacturer";
import OptionFactory from "./factories/option";
import ProductFactory from "./factories/product";
import type Model from "./model";

export default class Factory {
  constructor(private model: Model) {}

  public product = new ProductFactory(this.model);

  public category = new CategoryFactory(this.model);

  public option = new OptionFactory(this.model);

  public attribute = new AttributeFactory(this.model);

  public manufacturer = new ManufacturerFactory(this.model);

  destroyConnection() {
    return this.model.destroyConnection();
  }
}
