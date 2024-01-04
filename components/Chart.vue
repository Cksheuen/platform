<script setup>
import * as d3 from 'd3'

onMounted(() => {
  const width = 300
  const height = 400

  const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const data = {
    nodes: [
      { id: 'A', group: 1 },
      { id: 'B', group: 2 },
      { id: 'C', group: 2 },
      { id: 'D', group: 3 },
      { id: 'E', group: 3 },
      { id: 'F', group: 3 },
      { id: 'G', group: 4 },
      { id: 'H', group: 4 },
      { id: 'I', group: 4 },
      { id: 'J', group: 4 },
    ],
    links: [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
      { source: 'B', target: 'E' },
      { source: 'B', target: 'F' },
      { source: 'C', target: 'G' },
      { source: 'C', target: 'H' },
      { source: 'C', target: 'I' },
      { source: 'C', target: 'J' },
    ],
  }

  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

  const link = svg.append('g')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value))

  const node = svg.append('g')
    .selectAll('circle')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', d => d3.schemeCategory10[d.group])

  node.append('title')
    .text(d => d.id)

  node.on('mouseover', function (event, d) {
    d3.select(this)
      .transition()
      .duration(200)
      .attr('r', 10) // 放大圆圈
      .attr('cursor', 'pointer')

    // 显示数据
    svg.append('text')
      .attr('id', 'tooltip')
      .attr('x', event.pageX)
      .attr('y', event.pageY)
      .text(d.id)
  })
    .on('mouseout', function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 5) // 恢复圆圈大小

      // 移除数据
      d3.select('#tooltip').remove()
    })

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  })
})
</script>

<template>
  <div class="chart" />
</template>
