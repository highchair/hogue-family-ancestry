Hogue Family Tree
=================

And a Genealogy Jekyll Theme with custom post type of **People**.

## Credits

Marcel G. Hogue (generation 11) conducted most of the original research, with help from others as noted. He alone was able to trace the Hogue lineage back 12 generations to 1625. The generational numbers assume that future researchers will not be able to go further than 1625. Generation 1 starts with [Jean Hogue (1625–?)]({% link _person/1625-jean-hogue.md %})

Jason C. Hogue (generation 12) programmed this Jekyll theme and created the Liquid FrontMatter logic to store the work of his father and make it accessible to other descendants. This theme is open source and distributed with a Creative Commons license. Others may copy this and make it their own.

## Notes and Nuances

The Liquid FrontMatter of each Person is our data structure. Some nuances are required for things to connect properly:

1. **Every person has a unique identifier**: We have decided to use a birth date and first, middle initial, and last name structure (i.e. `1947-marcel-g-hogue.md`). When a middle name is not known, it is not present in the identifier. When the birth date is unknown, the identifier uses `unknown`. This is to distinguish common family names that have passed down through generations. These identifiers connect one person to another.
1. **People can be stubs**: Expanding upon the above, names do not have to use a unique identifier. Without the identifier, the name field becomes a string of text. Therefore, someone can be a “stub” — a dead-end, or someone without connections.
1. **Children are listed in one of two ways**: As much as possible, children are listed with their mothers. This is to avoid listing children twice — once under the father and then also under the mother. But when a mother does not have a page of their own, the children are listed with the father:
  1. The person’s spouse does not have a page of their own; therefore, the children are listed on the Father page under Partners & Spouse. _Example:_ [Jean Hogue (1625–?)]({% link _person/1625-jean-hogue.md %}) lists Nicole Dubus without a unique identifier, just a string of text. Children are listed on the Father’s page alongside the spouse he partnered with.
  1. The person’s spouse has a page, therefore, the children are listed there. _Example:_ [Pierre Hogue (1648–1725)]({% link _person/1648-pierre-hogue.md %}) had two partners, [Marie M. Nachita (1654–1676)]({% link _person/1654-marie-m-nachita.md %}) with whom they had two children and then [Jeanne Theodore (1654–1730)]({% link _person/1663-jeanne-theodore.md %}) with whom they had 10 children. Pierre’s page lists both partners but no children, while each partner lists the children they birthed on their own page.
1. **Most fields are optional**: Not every detail is known about everyone. Therefore, many fields are optional and will not render if left blank. Dates can be approximate, i.e. “about 1625” and will render as such. The only required fields are `slug` and name`.
1. **Marriages are listed twice** Details like the marriage date and location are present in both partners. When changing one, don’t forget to change the other.

## Ideas To Consider

1. Many names are French, as this is a French-Canadian lineage. Offer pronunciation audio clips?
1. There are a dozen generations, and documentation throughout these 400 years has moved from parchment paper and quill pens to typewriters and digital. Could a portion of each person’s page template expose this age? Would that be fun or annoying?
