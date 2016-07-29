# Fotolog Backup

Backup all posts from a given Fotolog.

- pictures
- pictures’ descriptions
- post date
- all comments, including its author and date


## Development

### Use

`node main <fotolog-name> <total-amount-of-posts>`

e.g. `node main moderaterock 60`

##### Useful Fotolog Links

- [moderaterock mosaic page](http://www.fotolog.com/moderaterock/mosaic/)
- [typical Fotolog post](http://www.fotolog.com/moderaterock/10239857/)
- [post with no comments](http://www.fotolog.com/moderaterock/15823889/)
- [post with no description](http://www.fotolog.com/moderaterock/13854190/)

### External dependencies

- [cheerio](https://github.com/cheeriojs/cheerio)
- [mkdir-promise](https://github.com/zbinlin/mkdir-promise)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [request](https://www.npmjs.com/package/request)

### To do

- [x] Finish `backup.js` module
- [x] Basic refactoring
- [ ] Less straightforward refactoring (e.g. proper error handling)
- [ ] Study and write some tests
- [ ] Develop UI for consuming backed up data
- [ ] Develop UI for inputing data so that people can use app outside CLI
- [ ] Get total amount of posts automatically
- [ ] Address more than 1 post per day
