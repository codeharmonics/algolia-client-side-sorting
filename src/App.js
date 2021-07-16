import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia.css';
import {
  InstantSearch,
  SearchBox,
  Pagination,
  Highlight,
  connectHits,
  Snippet,
  Configure,
  SortBy,
  Index,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

const searchClient = algoliasearch(
  '97B70U0A4O',
  '026c096eb3d38afb8cba6c2fef1d08ff'
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { currentSort: "1", totalHits: "20" };
  }

  onChangeLocalSort = e => {
    this.setState({ currentSort: e.target.value });
  }

  onChangeTotalHits = e => {
    this.setState({ totalHits: e.target.value });
  }

  render() {
//    console.log(this.state.totalHits);
    return (
      <div>
        <div className="search-container">

          <InstantSearch searchClient={searchClient} indexName="local-sorting">

            <main className="search-container">

              <Configure
                offset={10}
                length={this.state.totalHits}
                attributesToSnippet={["description:100"]}
                snippetEllipsisText=" [...]"
                getRankingInfo="true"
              />

              <div className="search-panel">
                <div className="search-panel__results">

                  <SearchBox className="searchbox" placeholder="Type in the same query for both columns..." />

                  <div class="ais-SortBy">
                    Total Hits&nbsp;&nbsp;
                    <select class="ais-SortBy-select" onChange={this.onChangeTotalHits}>
                      <option value="20">20</option>
                      <option value="100">100</option>
                      <option value="1000">1000</option>
                    </select>
                  </div>

                  <div className="row">

                    <div className="column">

                      <Index indexName="local-sorting">

                        <div class="ais-SortBy">
                          <select class="ais-SortBy-select" onChange={this.onChangeLocalSort}>
                            <option value="local-sorting">Sort By Relevance</option>
                            <option value="perform-local-sorting-asc">Sort Locally - asc</option>
                            <option value="perform-local-sorting-desc">Sort Locally - desc</option>
                          </select> (no replica, client-side sorting)
                        </div>

                        <LocalSortHits sortByValue = { this.state.currentSort } />

                      </Index>

                    </div>

                    <div className="column">

                      <Index indexName="local-sorting2">

                        <div><SortBy
                          defaultRefinement="local-sorting2"
                          items={[
                            { value: 'local-sorting2', label: 'By Relevance' },
                            { value: 'local-sorting-price-asc', label: 'Price asc (replica)' },
                            { value: 'local-sorting-price-desc', label: 'Price desc (replica)' },
                          ]}
                        /></div>

                        <LocalSortHits />

                      </Index>

                    </div>
{/*
                    <div className="column">

                      <Index indexName="local-sorting-price-custom-asc">

                        <SortBy
                          defaultRefinement="local-sorting-price-custom-asc"
                          items={[
                            { value: 'local-sorting-price-custom-asc', label: 'Price asc - Custom Ranking' },
                            { value: 'local-sorting-price-custom-desc', label: 'Price desc - Custom Ranking' }
                          ]}
                        />

                        <LocalSortHits />

                      </Index>

                    </div>
*/}
                  </div>
                </div>
              </div>
            </main>
          </InstantSearch>
        </div>
      </div>
    );
  }
}

function myHit(hit) {
  return (
    <div>
      <li className="ais-Hits-item fix_me">
        <div className="hit">
          <div className="hit-image">
            <img src={hit.image} />
          </div>
          <div className="hit-content">
            <div>
              <div className="hit-name">
                <Highlight attribute="name" hit={hit} tagName="em" />
              </div>
              <div className="hit-price">Popularity {hit.popularity}</div>
              <div className="hit-price">${hit.price}</div>
              <div className="hit-description">
                <div>nbTypos: {hit._rankingInfo.nbTypos}</div>
                <div>firstMatchedWord: {hit._rankingInfo.firstMatchedWord}</div>
                <div>proximityDistance: {hit._rankingInfo.proximityDistance}</div>
                <div>userScore: {hit._rankingInfo.userScore}</div>
                <div>nbExactWords: {hit._rankingInfo.nbExactWords}</div>
                <div>words: {hit._rankingInfo.words}</div>
                <div>filters: {hit._rankingInfo.filters}</div>
                </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
}

const LocalSortHits = connectHits(({ hits, sortByValue }) => {
  function renderPageWithOriginalSort(hits) {
    return (
        hits.map(myHit)
    )
  }
  function renderPageWithLocalSortPriceAsc(hits) {
    return (
      hits.sort((a, b) => a.price - b.price)
      .map(myHit)
    )
  }
  function renderPageWithLocalSortPriceDesc(hits) {
    return (
      hits.sort((a, b) => b.price - a.price)
      .map(myHit)
    )
  }

  return (
    <div>
    {(() => {
      switch(sortByValue) {
        case 'perform-local-sorting-asc':
          return renderPageWithLocalSortPriceAsc(hits);
        case 'perform-local-sorting-desc':
          return renderPageWithLocalSortPriceDesc(hits);
        default:
          return renderPageWithOriginalSort(hits);
      }
    })()}
    </div>
  )

});
myHit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;

/*
<div class="fix_me" id="hits">
  <div class="ais-Hits">
    <ul class="ais-Hits-list fix_me">
      <LocalSortHits />
    </ul>
  </div>
</div>

*/
