#ifndef org_apache_lucene_index_MultiLeafReader_H
#define org_apache_lucene_index_MultiLeafReader_H

#include "java/lang/Object.h"

namespace java {
  namespace lang {
    class Class;
  }
}
template<class T> class JArray;

namespace org {
  namespace apache {
    namespace lucene {
      namespace index {

        class MultiLeafReader : public ::java::lang::Object {
         public:

          static ::java::lang::Class *class$;
          static jmethodID *mids$;
          static bool live$;
          static jclass initializeClass(bool);

          explicit MultiLeafReader(jobject obj) : ::java::lang::Object(obj) {
            if (obj != NULL && mids$ == NULL)
              env->getClass(initializeClass);
          }
          MultiLeafReader(const MultiLeafReader& obj) : ::java::lang::Object(obj) {}
        };
      }
    }
  }
}

#include <Python.h>

namespace org {
  namespace apache {
    namespace lucene {
      namespace index {
        extern PyType_Def PY_TYPE_DEF(MultiLeafReader);
        extern PyTypeObject *PY_TYPE(MultiLeafReader);

        class t_MultiLeafReader {
        public:
          PyObject_HEAD
          MultiLeafReader object;
          static PyObject *wrap_Object(const MultiLeafReader&);
          static PyObject *wrap_jobject(const jobject&);
          static void install(PyObject *module);
          static void initialize(PyObject *module);
        };
      }
    }
  }
}

#endif
