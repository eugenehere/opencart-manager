# opencart-manager

Node.js package written in Typescript that allows you to manage your opencart store data easily.
Create products, attach categories or extract existing entities to edit them. Multilanguage supported.

## Installation

```bash
npm i opencart-manager
```

## Usage

```javascript
import opencartManager from 'opencart-manager';

const opencart = opencartManager({
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'database',
});

// Create new product
const product = opencart.product.create()
    .setData({ price: 800 })
    .setDescription({ languageId: 1, name: 'Apple iPhone X 256GB' })
    .setDescription({ languageId: 2, name: 'Apple iPhone X 256ГБ' })

await product.save();

// Attach product to an existing category
const category = await opencart.category.extract({ categoryId: 1 });
await product.toCategory(category);

// Update product
product.setData({ quantity: 250 });
await product.update();
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.