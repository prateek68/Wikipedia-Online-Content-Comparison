#ifndef org_apache_lucene_spatial3d_geom_XYZSolid_H
#define org_apache_lucene_spatial3d_geom_XYZSolid_H

#include "org/apache/lucene/spatial3d/geom/GeoArea.h"

namespace java {
  namespace lang {
    class Class;
  }
}
namespace org {
  namespace apache {
    namespace lucene {
      namespace spatial3d {
        namespace geom {
          class PlanetObject;
        }
      }
    }
  }
}
template<class T> class JArray;

namespace org {
  namespace apache {
    namespace lucene {
      namespace spatial3d {
        namespace geom {

          class XYZSolid : public ::org::apache::lucene::spatial3d::geom::GeoArea {
           public:

            static ::java::lang::Class *class$;
            static jmethodID *mids$;
            static bool live$;
            static jclass initializeClass(bool);

            explicit XYZSolid(jobject obj) : ::org::apache::lucene::spatial3d::geom::GeoArea(obj) {
              if (obj != NULL && mids$ == NULL)
                env->getClass(initializeClass);
            }
            XYZSolid(const XYZSolid& obj) : ::org::apache::lucene::spatial3d::geom::GeoArea(obj) {}
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
          extern PyType_Def PY_TYPE_DEF(XYZSolid);
          extern PyTypeObject *PY_TYPE(XYZSolid);

          class t_XYZSolid {
          public:
            PyObject_HEAD
            XYZSolid object;
            static PyObject *wrap_Object(const XYZSolid&);
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
