import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
<main class="card">
  <h1>Tip Calculator</h1>
  <label>Bill amount
    <input id="bill" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" />
  </label>
  <fieldset>
    <legend>Tip %</legend>
    <div class="presets">
      <button type="button" data-tip="10">10%</button>
      <button type="button" data-tip="15" class="active">15%</button>
      <button type="button" data-tip="20">20%</button>
      <input id="custom" type="number" min="0" step="0.5" placeholder="Custom %" />
    </div>
  </fieldset>
  <label>Number of people
    <input id="people" type="number" min="1" step="1" value="1" />
  </label>
  <p id="error" class="error" role="alert"></p>
  <section class="results">
    <div><span>Tip total</span><strong id="tip">0.00</strong></div>
    <div><span>Total</span><strong id="total">0.00</strong></div>
    <div class="hl"><span>Per person</span><strong id="per">0.00</strong></div>
  </section>
</main>`

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const bill = $<HTMLInputElement>('bill')
const custom = $<HTMLInputElement>('custom')
const people = $<HTMLInputElement>('people')
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-tip]')]
let presetTip = 15

const fmt = (n: number) => n.toFixed(2)

function update(): void {
  const errors: string[] = []
  const b = bill.value === '' ? 0 : Number(bill.value)
  const t = custom.value !== '' ? Number(custom.value) : presetTip
  const p = Number(people.value)
  if (!Number.isFinite(b) || b < 0) errors.push('Bill must be a non-negative number.')
  if (!Number.isFinite(t) || t < 0) errors.push('Tip % must be a non-negative number.')
  if (!Number.isInteger(p) || p < 1) errors.push('People must be a whole number of at least 1.')
  $('error').textContent = errors.join(' ')
  if (errors.length) {
    ;['tip', 'total', 'per'].forEach((id) => ($(id).textContent = '—'))
    return
  }
  const tip = (b * t) / 100
  $('tip').textContent = fmt(tip)
  $('total').textContent = fmt(b + tip)
  $('per').textContent = fmt((b + tip) / p)
}

buttons.forEach((btn) =>
  btn.addEventListener('click', () => {
    presetTip = Number(btn.dataset.tip)
    custom.value = ''
    buttons.forEach((b) => b.classList.toggle('active', b === btn))
    update()
  }),
)
custom.addEventListener('input', () => {
  buttons.forEach((b) => b.classList.toggle('active', custom.value === ''  && Number(b.dataset.tip) === presetTip))
  update()
})
bill.addEventListener('input', update)
people.addEventListener('input', update)
update()
