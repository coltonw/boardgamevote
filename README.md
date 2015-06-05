# The Indifference Engine

A voting engine for ranked votes allowing ties.

[![Build Status](https://travis-ci.org/coltonw/boardgamevote.svg?branch=master)](https://travis-ci.org/coltonw/boardgamevote) [![Coverage Status](https://img.shields.io/coveralls/coltonw/boardgamevote.svg)](https://coveralls.io/r/coltonw/boardgamevote) [![Dependency Status](https://gemnasium.com/coltonw/boardgamevote.svg)](https://gemnasium.com/coltonw/boardgamevote)

## Description

Currently this is used to vote on what board game my game group is going to play each week.

For an alternative way to choose a weekly board game / book / movie etc., check out [Revonarchy](https://github.com/coltonw/revonarchy)

## Usage

To run the site, you must clone this repository and also the [bgv-assets repo](https://github.com/coltonw/bgv-assets) which is all the static assets for this site.
You must also install [Python](https://www.python.org/download/) and MongoDB to get the database running.

Once you do that, run MongoDB and then run `npm install` in the boardgamevote directory to install all the node dependencies and then run `node index` to run the site.

You must also serve the static assets somewhere.
I did this by installing [http-server](https://github.com/nodeapps/http-server) and running it locally on port 3000, which is the default place this site looks for them in config.js.
You can also set an environment variable `STATIC_URL` to an alternative address.

## History

The engine started off as this [Go program](http://play.golang.org/p/w9aFrHdWmI) which used a modified Instant-runoff which allowed ties and eliminated based on lowest Borda count.
Eventually I realized that having the the elimination be based on Borda made this voting method into almost Borda but just a little stranger.

So when I first wrote the node.js indifference engine, it used my modified Instant-runoff but with Borda only for **tiebreaking** for the elimination.

The last thing I added was a random ballot tiebreaker for if there is a tie even with Borda.

The downside of using Instant-runoff for small numbers of votes is that it essentially eliminates compromises.
This is slightly improved because you can vote for multiple things at once, very similar to Approval voting but not quite.
But this made a strange model where it was hugely to your advantage to vote as if it was an approval ballot, with all the ones you approve of tied for first.
Except it was also to your advantage to rank all the ones you disapprove of in order.

In order to eliminate this counter-intuitiveness, I created new voting methods.

## Voting methods

The current main voting method is Minmax Pairwise Opposition but the legacy Instant-runoff still exists.

We are working on a Maximize Affirmed Majorities/Minimize Thwarted Minorities voting method next.
While giving technically better results than MMPO, MAM/MTM is more vulnerable to strategic voting like bullet-voting (voting one thing first and everything else second).
Allowing the ballot creator to choose whether he trusts his voters or not will be what determines the final voting method used.

## Credit

- [Will Colton](https://github.com/coltonw)
- [Ryan Malec](http://github.com/rwm28)


## License

MIT
