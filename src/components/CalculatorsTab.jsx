import { useState } from 'react';
import { Scale, Flame, Droplets } from 'lucide-react';

export default function CalculatorsTab() {
  // Calculadora 1: IMC
  const [imcPeso, setImcPeso] = useState('70');
  const [imcAltura, setImcAltura] = useState('1.70');

  // Calculadora 2: TMB & GET
  const [tmbSexo, setTmbSexo] = useState('Feminino');
  const [tmbIdade, setTmbIdade] = useState('30');
  const [tmbPeso, setTmbPeso] = useState('65');
  const [tmbAltura, setTmbAltura] = useState('165');
  const [tmbAtividade, setTmbAtividade] = useState('1.375'); // Levemente ativo

  // Calculadora 3: Água
  const [aguaPeso, setAguaPeso] = useState('70');
  const [aguaIntensidade, setAguaIntensidade] = useState('35'); // 35ml/kg

  // Cálculo IMC
  const getImcResults = () => {
    const p = parseFloat(imcPeso);
    let a = parseFloat(imcAltura);
    if (!p || !a || a <= 0) return null;
    if (a > 3) a = a / 100;
    const imc = p / (a * a);
    const minPeso = (18.5 * a * a).toFixed(1);
    const maxPeso = (24.9 * a * a).toFixed(1);

    let faixa = 'Normal';
    let cor = 'var(--primary)';
    if (imc < 18.5) { faixa = 'Abaixo do peso'; cor = '#eab308'; }
    else if (imc < 25) { faixa = 'Peso Normal / Eutrófico'; cor = '#10b981'; }
    else if (imc < 30) { faixa = 'Sobrepeso (Pré-obesidade)'; cor = '#f97316'; }
    else if (imc < 35) { faixa = 'Obesidade Grau I'; cor = '#ef4444'; }
    else if (imc < 40) { faixa = 'Obesidade Grau II'; cor = '#dc2626'; }
    else { faixa = 'Obesidade Grau III (Mórbida)'; cor = '#991b1b'; }

    return {
      imc: imc.toFixed(2),
      faixa,
      cor,
      minPeso,
      maxPeso
    };
  };

  // Cálculo TMB & GET (Mifflin-St Jeor & Harris-Benedict)
  const getTmbResults = () => {
    const p = parseFloat(tmbPeso);
    let a = parseFloat(tmbAltura);
    const i = parseFloat(tmbIdade);
    const fAtiv = parseFloat(tmbAtividade);

    if (!p || !a || !i) return null;
    if (a < 3) a = a * 100; // cm

    // Mifflin - St Jeor
    let mifflin = (10 * p) + (6.25 * a) - (5 * i);
    if (tmbSexo === 'Masculino') mifflin += 5;
    else mifflin -= 161;

    // Harris - Benedict (Revisada)
    let harris = 0;
    if (tmbSexo === 'Masculino') {
      harris = 88.362 + (13.397 * p) + (4.799 * a) - (5.677 * i);
    } else {
      harris = 447.593 + (9.247 * p) + (3.098 * a) - (4.330 * i);
    }

    const get = Math.round(mifflin * fAtiv);

    return {
      mifflin: Math.round(mifflin),
      harris: Math.round(harris),
      get
    };
  };

  // Cálculo Água
  const getAguaResults = () => {
    const p = parseFloat(aguaPeso);
    const ml = parseFloat(aguaIntensidade);
    if (!p || !ml) return null;
    const totalMl = p * ml;
    const totalLitros = (totalMl / 1000).toFixed(2);
    const copos250 = Math.round(totalMl / 250);
    return { totalMl: Math.round(totalMl), totalLitros, copos250 };
  };

  const imcData = getImcResults();
  const tmbData = getTmbResults();
  const aguaData = getAguaResults();

  return (
    <div className="calculators-container">
      <div className="tab-header-title">
        <h3>Calculadoras Nutricionais Clínicas</h3>
        <p>Ferramentas ágeis para avaliação antropométrica, gasto energético e prescrição hídrica</p>
      </div>

      <div className="calculators-grid">
        {/* Card 1: IMC */}
        <div className="calc-card">
          <div className="calc-card-header">
            <div className="calc-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
              <Scale size={20} />
            </div>
            <h4>Índice de Massa Corporal (IMC)</h4>
          </div>

          <div className="calc-inputs-row">
            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={imcPeso}
                onChange={(e) => setImcPeso(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Altura (m ou cm)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={imcAltura}
                onChange={(e) => setImcAltura(e.target.value)}
              />
            </div>
          </div>

          {imcData && (
            <div className="calc-result-box">
              <div className="calc-main-stat">
                <span className="calc-stat-label">IMC Calculado:</span>
                <span className="calc-stat-number" style={{ color: imcData.cor }}>{imcData.imc} kg/m²</span>
              </div>
              <div className="calc-status-badge" style={{ backgroundColor: imcData.cor + '20', color: imcData.cor }}>
                {imcData.faixa}
              </div>
              <div className="calc-sub-details">
                Faixa de Peso Saudável para esta altura: <strong>{imcData.minPeso} kg</strong> a <strong>{imcData.maxPeso} kg</strong>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: TMB e GET */}
        <div className="calc-card">
          <div className="calc-card-header">
            <div className="calc-icon-wrapper" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
              <Flame size={20} />
            </div>
            <h4>Taxa Metabólica Basal & GET</h4>
          </div>

          <div className="calc-inputs-row">
            <div className="form-group">
              <label>Sexo</label>
              <select className="form-control" value={tmbSexo} onChange={(e) => setTmbSexo(e.target.value)}>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>
            <div className="form-group">
              <label>Idade (anos)</label>
              <input
                type="number"
                className="form-control"
                value={tmbIdade}
                onChange={(e) => setTmbIdade(e.target.value)}
              />
            </div>
          </div>

          <div className="calc-inputs-row">
            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                className="form-control"
                value={tmbPeso}
                onChange={(e) => setTmbPeso(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Altura (cm)</label>
              <input
                type="number"
                className="form-control"
                value={tmbAltura}
                onChange={(e) => setTmbAltura(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nível de Atividade Física (Fator de Atividade)</label>
            <select
              className="form-control"
              value={tmbAtividade}
              onChange={(e) => setTmbAtividade(e.target.value)}
            >
              <option value="1.2">Sedentário (1.20) — Pouco ou nenhum exercício</option>
              <option value="1.375">Levemente Ativo (1.375) — Exercício leve 1-3 dias/sem</option>
              <option value="1.55">Moderadamente Ativo (1.55) — Exercício moderado 3-5 dias/sem</option>
              <option value="1.725">Muito Ativo (1.725) — Exercício pesado 6-7 dias/sem</option>
              <option value="1.9">Extremamente Ativo (1.90) — Atleta de alto rendimento</option>
            </select>
          </div>

          {tmbData && (
            <div className="calc-result-box">
              <div className="calc-main-stat">
                <span className="calc-stat-label">Gasto Energético Total (GET):</span>
                <span className="calc-stat-number" style={{ color: '#ef4444' }}>{tmbData.get} kcal/dia</span>
              </div>
              <div className="calc-sub-details" style={{ marginTop: '0.5rem' }}>
                • TMB Mifflin-St Jeor: <strong>{tmbData.mifflin} kcal</strong><br />
                • TMB Harris-Benedict: <strong>{tmbData.harris} kcal</strong>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Ingestão Hídrica */}
        <div className="calc-card">
          <div className="calc-card-header">
            <div className="calc-icon-wrapper" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <Droplets size={20} />
            </div>
            <h4>Ingestão Hídrica Recomendada</h4>
          </div>

          <div className="calc-inputs-row">
            <div className="form-group">
              <label>Peso do Paciente (kg)</label>
              <input
                type="number"
                className="form-control"
                value={aguaPeso}
                onChange={(e) => setAguaPeso(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fator de Recomendação</label>
              <select
                className="form-control"
                value={aguaIntensidade}
                onChange={(e) => setAguaIntensidade(e.target.value)}
              >
                <option value="30">30 ml/kg (Adulto sedentário / Idosos)</option>
                <option value="35">35 ml/kg (Padrão ouro adulto saudável)</option>
                <option value="40">40 ml/kg (Praticante de atividade física)</option>
                <option value="45">45 ml/kg (Treinos intensos / Clima quente)</option>
              </select>
            </div>
          </div>

          {aguaData && (
            <div className="calc-result-box">
              <div className="calc-main-stat">
                <span className="calc-stat-label">Meta Hídrica Diária:</span>
                <span className="calc-stat-number" style={{ color: '#0284c7' }}>{aguaData.totalLitros} Litros</span>
              </div>
              <div className="calc-sub-details" style={{ marginTop: '0.5rem' }}>
                Equivalente a aproximadamente <strong>{aguaData.copos250} copos de 250ml</strong> ao longo do dia ({aguaData.totalMl} ml).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
