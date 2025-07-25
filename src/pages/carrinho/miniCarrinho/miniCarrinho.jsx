import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../../../context/carrinhoContext";
import styles from "./miniCarrinho.module.css"; // CORRIGIDO: nome do arquivo
import { Botao } from "../../../components/Botao/botao";
import ApiService from "../../../services/api.js";

export function MiniCarrinho({ onClose }) {
  // Adicionei onClose
  const {
    carrinhoItens,
    totalPreco,
    removerDoCarrinho,
    atualizarQuantia,
    finalizarCompra,
    totalItens,
  } = useCarrinho();
  const navigate = useNavigate();

  function calcularFreteFront(quantidade) {
    const valorBase = 5.0;
    const adicionalPorItem = 1.0;
    return valorBase + adicionalPorItem * quantidade;
  }

  const frete = calcularFreteFront(totalItens);
  const totalFinal = totalPreco + frete;

  const handleFinalizarCompra = () => {
    finalizarCompra();
    if (onClose) onClose();
  };

  const handleVerCarrinho = () => {
    navigate("/carrinho");
    if (onClose) onClose(); // Fechar o mini carrinho ao navegar
  };

  return (
    <div className={styles.miniCarrinho}>
      {carrinhoItens.length === 0 ? (
        <p className={styles.vazio}>Seu carrinho está vazio</p>
      ) : (
        <>
          <ul className={styles.listaItens}>
            {carrinhoItens.map(({ produto, quantidade }) => (
              <li key={produto.id} className={styles.item}>
                <img
                  src={ApiService.getFotoProduto(produto.id)}
                  alt={produto.nome}
                  className={styles.foto}
                />
                <div className={styles.info}>
                  {" "}
                  {/* CORRIGIDO: remover aspas */}
                  <div className={styles.nome}>{produto.nome}</div>
                  <div className={styles.codigo}>ID: {produto.id}</div>
                  <div className={styles.detalhes}>
                    <input
                      type="number"
                      min="1"
                      max={produto.estoque}
                      value={quantidade}
                      onChange={(e) => {
                        const novaQuantidade = parseInt(e.target.value);
                        if (
                          novaQuantidade >= 1 &&
                          novaQuantidade <= produto.estoque
                        ) {
                          atualizarQuantia(produto.id, novaQuantidade);
                        }
                      }}
                      className={styles.quantidadeInput}
                    />
                    <div className={styles.precoUnitario}>
                      R$ {produto.preco.toFixed(2)}
                    </div>
                    <div className={styles.subtotal}>
                      Subtotal: R$ {(produto.preco * quantidade).toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  className={styles.remover}
                  onClick={() => removerDoCarrinho(produto.id)}
                  aria-label={`Remover ${produto.nome} do carrinho`}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.resumo}>
            <p className={styles.total}>
              {/* CORRIGIDO: Remover parênteses */}
              Total Itens: <strong>{totalItens}</strong>
            </p>
            <p className={styles.total}>
              Frete: <strong>R$ {frete.toFixed(2)}</strong>
            </p>
            <p className={styles.total}>
              Total: <strong>R$ {totalFinal.toFixed(2)}</strong>
            </p>
            <div className={styles.botoes}>
              <button
                onClick={handleVerCarrinho}
                className={styles.botaoSecundario}
              >
                Ver Carrinho
              </button>
              <button
                onClick={handleFinalizarCompra}
                className={styles.botaoPrincipal}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
