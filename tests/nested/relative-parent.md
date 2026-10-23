# Nested File, Parent-Relative References

This file lives in `tests/nested/`, and references images one level up via `../`.

## Parent folder images

![Red from parent](../images/red.png)

![Green from parent](../images/green.png)

## Parent folder with `./` prefix

![Blue from parent, dot-slash](./../images/blue.png)

## Image with title from parent

![Logo from parent](../images/logo.svg "The logo, one level up")
