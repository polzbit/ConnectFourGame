import TileHole from './TileHole';

const Tile = (props) => {
    return (
        <div className="Tile" onClick={() => props.handleClick()}>
            {
                [...Array(props.holes.length)].map((x, j) => 
                    <TileHole key={j} value={props.holes[j]}></TileHole>)
                }
        </div>
    )
}

export default Tile;