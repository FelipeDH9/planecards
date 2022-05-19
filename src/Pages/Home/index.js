import { useState, useEffect } from 'react'
// import NoCards from '../../components/NoCards'
import { getCards } from '../../services/magic/index'
import { FaSearch } from 'react-icons/fa'
import ReactPaginate from 'react-paginate'
import { toInteger } from 'lodash'
import Loading from '../../components/Loading'
import useWindowDimensions from '../../hooks/useWindowResize'
import './styles.css'

function Home() {
  const [currentCards, setCurrentCards] = useState()
  const [cardName, setCardName] = useState()
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const pageSize = 20
  const { width, height } = useWindowDimensions()

  async function fetchData(currentPage = 1) {
    setLoading(true)
    console.log({ currentPage })
    const { data, headers } = await getCards({
      name: cardName,
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

  const handlePageClick = async event => {
    // console.log({ select: event.selected })
    await fetchData(event.selected + 1)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="body-home">
      <h3>Pesquisa</h3>
      <div className="search">
        <input
          type="text"
          placeholder="Digite o nome da carta..."
          autoFocus="autofocus"
          onChange={value => setCardName(value.target.value)}
        ></input>

        <button className="button" onClick={() => fetchData()}>
          <FaSearch />
        </button>
      </div>

      <table id="cardList">
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
      {/* <table id="cardList">
        <tbody>
          {currentItems?.map(card => {
            return (
              <tr>
                {card.imageUrl && (
                  <tr>
                    <td>
                      <a href={`/card/${card.id}`} className="tooltip">
                        {card.name}
                        <img
                          className="tooltipimage"
                          src={card.imageUrl}
                          alt={card.name}
                        ></img>
                      </a>
                    </td>
                    <td>{card.setName}</td>
                  </tr>
                )}
              </tr>
            )
          })}
        </tbody>
      </table> */}
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
