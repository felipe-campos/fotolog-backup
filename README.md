# Fotolog Backup

Backup all posts from a given Fotolog.

- pictures
- pictures’ descriptions
- post date
- all comments, including its author and date


## Development

### Use

`node main <fotolog-name> <total-amount-of-posts>`

Currently, there are 3 hardcoded posts IDs, for development purposes. Therefore, you should use **moderaterock** as the Fotolog. It’s got 60 posts, so run `node main moderaterock 60`.

### External dependencies

- [request](https://www.npmjs.com/package/request)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [cheerio](https://github.com/cheeriojs/cheerio)

### To do

- [ ] Finish `backup.js` module
- [ ] Refactoring
- [ ] Adress more than 1 post per day
- [ ] Get total amount of posts automatically
