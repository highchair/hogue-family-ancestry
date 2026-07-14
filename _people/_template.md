---
layout: person
slug: # Unique identifier: the documented year of birth or baptism, then name
name: ''
full-name:
alt-names: [] # Maiden names
alt-spelling: [] # Variations in spelling
major_generation: # Single digit, i.e. 3
generation: # Decimal, i.e. 3.1
revised-date: # Last time this information was updated

# If only the baptism date exists, we use that for an approximate birth date
# though, of course, there is no guarantee baptism quickly followed birth. Use 'about XXXX'

born:
  date:
  location:
baptized:
  date:
  location:

# If only the buried date exists, we use that for an approximate death date
# though, of course, there is no guarantee burial quickly followed death. Use 'about XXXX'

death:
  date:
  location:
buried:
  date:
  location:
age-at-death: # Use https://www.timeanddate.com/date/durationresult.html to calculate duration

# If parent names are strings, not unique slugs, they MUST match in order for children to be queried
father:
mother:

# If the spouse has no page of their own, use the FrontMatter below to store their metadata
# Otherwise, use the unique IDs for spouse and union only

partners:
  - spouse:
    union:
    union-date: # Store here if no union exists in data.children
    union-location: # Store here if no union exists in data.children
    spouse-parents:
    spouse-born:
    spouse-born-location:
    spouse-death:

---

