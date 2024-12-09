import clsx from 'clsx';

const ViewEye = ({ className, ...props }: { className: string }) => {
  return (
    <svg className={clsx('inline-block h-6 w-8', className)} {...props}>
      <g transform="matrix(1 0 0 1 -312 -362 )">
        <path
          d="M 16.027729636048527 8.571428571428571  C 16.027729636048527 7.955357142857143  15.811438474870018 7.376785714285714  15.561871750433276 6.87857142857143  C 15.717157712305024 6.862500000000001  15.872443674176775 6.857142857142857  16.027729636048527 6.857142857142857  C 18.967071057192374 6.857142857142857  21.351819757365686 9.1125  21.351819757365686 12  C 21.351819757365686 14.839285714285714  18.967071057192374 17.142857142857142  16.027729636048527 17.142857142857142  C 13.03847487001733 17.142857142857142  10.70363951473137 14.839285714285714  10.70363951473137 12  C 10.70363951473137 11.85  10.709185441941074 11.7  10.725823223570192 11.55  C 11.24159445407279 11.791071428571428  11.84055459272097 12  12.478336221837088 12  C 14.436048526863086 12  16.027729636048527 10.4625  16.027729636048527 8.571428571428571  Z M 26.709185441941077 4.317857142857143  C 29.304679376083186 6.642857142857143  31.040554592720973 9.380357142857143  31.861351819757367 11.341071428571428  C 32.04436741767764 11.764285714285714  32.04436741767764 12.235714285714284  31.861351819757367 12.658928571428572  C 31.040554592720973 14.57142857142857  29.304679376083186 17.308928571428574  26.709185441941077 19.682142857142857  C 24.097053726169843 22.02857142857143  20.508838821490468 24  16.027729636048527 24  C 11.546620450606586 24  7.95840554592721 22.02857142857143  5.34738301559792 19.682142857142857  C 2.751889081455806 17.308928571428574  1.0171230502599653 14.57142857142857  0.19194454072790293 12.658928571428572  C 0.009954939341421144 12.235714285714284  0.009954939341421144 11.764285714285714  0.19194454072790293 11.341071428571428  C 1.0171230502599653 9.380357142857143  2.751889081455806 6.642857142857143  5.34738301559792 4.317857142857143  C 7.95840554592721 1.9735714285714288  11.546620450606586 0  16.027729636048527 0  C 20.508838821490468 0  24.097053726169843 1.9735714285714288  26.709185441941077 4.317857142857143  Z M 24.013864818024263 12  C 24.013864818024263 7.741071428571429  20.4367417677643 4.285714285714286  16.027729636048527 4.285714285714286  C 11.618717504332755 4.285714285714286  8.04159445407279 7.741071428571429  8.04159445407279 12  C 8.04159445407279 16.25892857142857  11.618717504332755 19.714285714285715  16.027729636048527 19.714285714285715  C 20.4367417677643 19.714285714285715  24.013864818024263 16.25892857142857  24.013864818024263 12  Z "
          fillRule="nonzero"
          fill="#c0c0c0"
          stroke="none"
          transform="matrix(1 0 0 1 312 362 )"
        />
      </g>
    </svg>
  );
};

export default ViewEye;