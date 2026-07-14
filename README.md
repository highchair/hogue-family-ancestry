Hogue Family Tree
=================

A Genealogy Jekyll Theme with custom post type of **People**.


## Credits

Marcel G. Hogue (generation 11.32) conducted the bulk of the original research, with help from others as noted. He was able to trace the Hogue lineage back 12 generations to 1625. The generational numbers assume that future researchers will not be able to go further than 1625. Generation 1 starts with [Jean Hogue (1625–?)](/person/1625-jean-hogue/)

Jason C. Hogue (generation 12) programmed this Jekyll theme and created the Liquid FrontMatter logic to store the work of his father and make it accessible to other descendants. This theme is open source and distributed with a Creative Commons license. Others may copy this and make it their own.


## Getting localhost working

For the first time install, from the folder root, run `bundle install`. If no conflicts bubble up, from project root, run `bundle exec jekyll serve` and visit [127.0.0.1:6040/](http://127.0.0.1:6040/) to view the site.

There is no navigation yet, as of June 2026. to get started, visit the root of the Family Tree, [Jean Hogue (1625–?)](http://127.0.0.1:6040/person/1625-jean-hogue/)


## Notes and Nuances

The Liquid FrontMatter of each Person is our data structure. Some nuances are required for things to connect properly:

1. **Every person has a unique identifier**: We have decided to use a birth date and first, middle initial, and last name structure (i.e. `1947-marcel-g-hogue.md`). When a middle name is not known, it is not present in the identifier. When the birth date is unknown, the identifier uses `unknown`. This is to distinguish common family names that have passed down through generations. These identifiers connect one person to another.
1. **People can be stubs**: Expanding upon the above, names do not have to use a unique identifier. Without the identifier, the name field becomes a string of text. Therefore, someone can be a “stub” — a dead-end, or someone without connections.
  a. First names of “Marie” are skipped in favor of the first name for women. “Jean” would be skipped for men, except that it is often the only name.
1. **Children are listed in a Data file**: Jekyll uses YML to store data structures. We use a YML file to store children and use a `partnership` field that leverages unique IDs of both parents. This allows us to query siblings and children more easily, and keep all the data in one place. this proved to be the hardest data structure to get right for these purposes.
  a. The `union` of two people is recorded with the children. Optionally, when there no need for children to be stored in the YML file, one can add the `union` details to the `partners` FrontMatter on the individual person.
1. **Most fields are optional**: Not every detail is known about everyone. Therefore, many fields are optional and will not render if left blank. Dates can be approximate, i.e. “about 1625” and will render as such. The only required fields are `slug` and `name`.


## Ideas To Consider

1. Many names are French, as this is a French-Canadian lineage. Should we offer pronunciation audio clips?
1. There are a dozen generations, and documentation throughout these 400 years has moved from parchment paper and quill pens to typewriters and digital. Could a portion of each person’s page template expose this age? Would that be fun or annoying?
