#ifndef org_apache_lucene_spatial3d_geom_GeoPolygon_H
#define org_apache_lucene_spatial3d_geom_GeoPolygon_H

#include "org/apache/lucene/spatial3d/geom/GeoAreaShape.h"

namespace java {
  namespace lang {
    class Class;
  }
}
template<class T> class JArray;

namespace org {
  namespace apache {
    namespace lucene {
      namespace spatial3d {
        namespace geom {

          class GeoPolygon : public ::org::apache::lucene::spatial3d::geom::GeoAreaShape {
           public:

            static ::java::lang::Class *class$;
            static jmethodID *mids$;
            static bool live$;
            static jclass initializeClass(bool);

            explicit GeoPolygon(jobject obj) : ::org::apache::lucene::spatial3d::geom::GeoAreaShape(obj) {
              if (obj != NULL && mids$ == NULL)
                env->getClass(initializeClass);
            }
            GeoPolygon(const GeoPolygon& obj) : ::org::apache::lucene::spatial3d::geom::GeoAreaShape(obj) {}
          };
        }
      }
    }
  }
}

#include <Python.h>

namespace org {
  namespace apache {
    namespace lucene {
      namespace spatial3d {
        namespace geom {
          extern PyType_Def PY_TYPE_DEF(GeoPolygon);
          extern PyTypeObject *PY_TYPE(GeoPolygon);

          class t_GeoPolygon {
          public:
            PyObject_HEAD
            GeoPolygon object;
            static PyObject *wrap_Object(const GeoPolygon&);
            static PyObject *wrap_jobject(const jobject&);
            static void install(PyObject *module);
            static void initialize(PyObject *module);
          };
        }
      }
    }
  }
}

#endif
