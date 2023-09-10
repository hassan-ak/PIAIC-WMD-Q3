# Queries in gql

- https://countries.trevorblades.com/

**Operation name**

```gql
query GetCountries {
}
```

**Query**

```gql
query GetCountries {
  countries {
  }
}
```

**Fields**

```gql
query GetCountry {
  country {
    name
    languages {
      code
      name
    }
  }
}
```

**Arguments**

```gql
query GetCountry {
  country(code: "BR") {
    name
    languages {
      code
      name
    }
  }
}
```

**Aliases**

```gql
query GetCountry {
  selectedCountry: country(code: "BR") {
    name
    languages {
      code
      name
    }
  }
}
```

**Fragments**

```gql
query GetCountry {
  leftComparison: country(code: "AR") {
    ...comparisonFields
  }
  rightComparison: country(code: "CA") {
    ...comparisonFields
  }
}
fragment comparisonFields on Country {
  name
  code
}
```

**Variables**

```gql
query GetCountry($code: ID!) {
  selectedCountry: country(code: $code) {
    name
    code
    languages {
      code
      name
    }
  }
}
```

```
{
  "code": "PT"
}
```

**Default variables**

```gql
query GetCountry($code: ID! = "PT") {
  selectedCountry: country(code: $code) {
    name
    code
    languages {
      code
      name
    }
  }
}
```

**Using variables inside fragments**

```gql
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```

**Directives**

```gql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

```
{
  "episode": "JEDI",
  "withFriends": false
}
```
