import './styles.css'

// axios
import { getCards } from '../../services/magic/index'

import ReactPaginate from 'react-paginate'

// components
import Loading from '../../components/Loading'

// hooks
import { useState, useEffect } from 'react'
import useWindowDimensions from '../../hooks/useWindowResize'
// import { FaSearch } from 'react-icons/fa'

function Home() {
  const [currentCards, setCurrentCards] = useState()
  const [cardName, setCardName] = useState()
  const { width } = useWindowDimensions()
  const [loading, setLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const pageSize = 24

  const fetchData = async (currentPage = 1) => {
    setLoading(true)
    const { data, headers } = await getCards({
      name: cardName,
      contains: 'imageUrl',
      pageSize,
      page: currentPage
    })
    setLoading(false)

    if (data) {
      const cards = await data.cards
      const totalCount = headers['total-count'] || 0
      setPageCount(Math.ceil(totalCount / pageSize))
      setCurrentCards(cards)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    fetchData()
  }

  const handlePageClick = async event => {
    await fetchData(event.selected + 1)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="body-home">
      <h3>Pesquisa</h3>

      {/* search input */}
      <div className="search">
        <form onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Digite o nome da carta..."
            autoFocus="autofocus"
            onChange={value => setCardName(value.target.value)}
          ></input>
        </form>
        <div className="button-wrapper">
          <input type="submit" value="Buscar" className="button" />
        </div>
      </div>

      {/* responsive list */}
      {width <= 767 ? (
        <div className="cards-image-list">
          {!loading ? (
            <div className="flex-wrapper">
              {currentCards?.map(card => (
                <a href={`/card/${card.id}`} key={card.id}>
                  <img
                    src={card.imageUrl}
                    alt="card"
                    className="card-image"
                  ></img>
                </a>
              ))}
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '50vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Loading />
            </div>
          )}
        </div>
      ) : (
        <table id="card-table-list">
          <tbody>
            {!loading ? (
              currentCards?.map(card => (
                <tr key={card.id}>
                  <td className="card-name">
                    {card.imageUrl ? (
                      <a href={`/card/${card.id}`} className="tooltip">
                        {card.name}
                        <img
                          className="tooltipimage"
                          src={card.imageUrl}
                          alt="card"
                        ></img>
                      </a>
                    ) : (
                      <p>{card.name}</p>
                    )}
                  </td>
                  <td>{card.setName}</td>
                </tr>
              ))
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '50vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Loading />
              </div>
            )}
          </tbody>
        </table>
      )}

      {currentCards && (
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="active"
        />
      )}
    </div>
  )
}

export default Home
