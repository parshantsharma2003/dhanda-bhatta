const mongoose = require('mongoose');

async function sync() {
  await mongoose.connect('mongodb://127.0.0.1:27017/dhanda_bhatta');
  const collection = mongoose.connection.collection('products');

  await collection.updateOne(
    { slug: 'first-class-red-bricks' },
    {
      $set: {
        images: [
          {
            url: '/images/products/class-1-hanuman-brick.jpg',
            alt: "First Class Red Clay Brick with 'हनुमान' frog brand",
            caption: "First Class red clay brick with authentic 'हनुमान' brand mark, manufactured at Village Kalwa",
            isPrimary: true,
          },
          {
            url: '/images/products/class-1-red-brick-stack.jpg',
            alt: 'Stepped stack of first class red clay bricks in kiln yard',
            caption: 'Cured first class red clay brick stacks ready for masonry delivery',
            isPrimary: false,
          },
          {
            url: '/images/products/class-1-hanuman-brick-alt.jpg',
            alt: 'Detail view of first class clay brick frog',
            caption: "Sharp arrises and clear 'हनुमान' frog embossing",
            isPrimary: false,
          },
        ],
      },
    }
  );

  await collection.updateOne(
    { slug: 'standard-construction-bricks' },
    {
      $set: {
        images: [
          {
            url: '/images/products/standard-hbc-brick.jpg',
            alt: "Standard Construction Bricks with 'HBC' brand stamp",
            caption: "Standard kiln-fired construction bricks with authentic 'HBC' frog mark",
            isPrimary: true,
          },
          {
            url: '/images/products/standard-hbc-brick-stack.png',
            alt: 'Standard brick stack in yard with kiln chimney in background',
            caption: 'Solid stack of cured standard construction bricks with kiln chimney in the background',
            isPrimary: false,
          },
          {
            url: '/images/products/standard-stepped-stack.jpg',
            alt: 'Stepped stack of standard construction bricks',
            caption: 'Stockyard stacks sorted for partition and general building masonry',
            isPrimary: false,
          },
        ],
      },
    }
  );

  await collection.updateOne(
    { slug: 'foundation-soling-bricks' },
    {
      $set: {
        images: [
          {
            url: '/images/products/soling-brick-stack.png',
            alt: 'Dense brick stacks in kiln yard for sub-base flooring and foundation',
            caption: 'Heavy kiln-fired bricks selected for sub-base flooring and foundation trench soling',
            isPrimary: true,
          },
          {
            url: '/images/products/soling-vent-stack.png',
            alt: 'Cooling clamp arrangement for dense foundation bricks',
            caption: 'Cooling clamp arrangement in the Kalwa stockyard',
            isPrimary: false,
          },
        ],
      },
    }
  );

  console.log('MongoDB products successfully updated with authentic images!');
  const docs = await collection
    .find(
      { slug: { $in: ['first-class-red-bricks', 'standard-construction-bricks', 'foundation-soling-bricks'] } },
      { projection: { slug: 1, 'images.url': 1 } }
    )
    .toArray();
  console.log(JSON.stringify(docs, null, 2));
  await mongoose.disconnect();
}

sync().catch(console.error);
